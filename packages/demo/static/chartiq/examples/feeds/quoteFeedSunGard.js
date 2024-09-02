/* eslint-disable no-undef */
//-------------------------------------------------------------------------------------------
// Copyright 2012-2020 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------

(function (definition) {
	"use strict";

	if (typeof exports === "object" && typeof module === "object") {
		module.exports = definition(require("chartiq"));
	} else if (typeof define === "function" && define.amd) {
		define(["chartiq"], definition);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		definition(global);
	} else {
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for quoteFeedSunGard.js.");
	}
})(function (_exports) {
	var CIQ = _exports.CIQ,
		timezoneJS = _exports.timezoneJS;

	/**
	 * Quotefeed implementation for the FIS MarketMap Muse.js quote feed.
	 *
	 * See tutorial [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds} for a complete overview and
	 * step by step source code for implementing a quotefeed
	 **
	 * @name quoteFeedSunGard
	 */

	var quoteFeedSunGard = (_exports.quoteFeedSunGard = {});
	quoteFeedSunGard.museParams = {};
	quoteFeedSunGard.isConnected = false;
	quoteFeedSunGard.requestId = 0;
	quoteFeedSunGard.maxTicks = 1500; // The real max is 1600 but we take off a few in case the quotefeed returns some data outside of the market times.
	quoteFeedSunGard.debug = false; // set to true to see the requests made to server

	quoteFeedSunGard.entitlementMap = {
		"": "DELAYED",
	};

	/**
	 * Add credentials to the quotefeed.  This is optional; if not added, will load from a 'credential.js' file located in the same directory as the html template which included this file
	 *
	 * @param {object} museParams   -Params object for Muse.JS
	 * @param {string} museParams.credentialFile   Optional relative path to credential file
	 * @param {array} museParams.server    Array of muse server URIs
	 * @param {string} museParams.group    Group parameter for Muse.JS connection
	 * @param {string} museParams.login    Login parameter for Muse.JS connection
	 * @param {string} museParams.password    Password parameter for Muse.JS connection
	 * @param {object} museParams.log    Muse.JS log level
	 * @param {object} museParams.outputFormat	 Muse.JS Outputformat(1:verbose, 2:concise); default is 2
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.addCredentials = function (museParams) {
		quoteFeedSunGard.museParams = museParams;
	};
	/**
	 * Helper method to determine number of minutes for the bar size for the TimeScale parameter of the Muse.JS API
	 *
	 * @param {number} period                -The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} interval            -The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @returns {number}                    -Number of minutes in the period * interval
	 * @private
	 */
	quoteFeedSunGard.getMuseTimeScale = function (period, interval) {
		var timeScale;
		switch (interval) {
			case "millisecond":
				console.error("millisecond interval not supported by Muse.JS interface. Defaulting to `minute` timescale");
				timeScale = period * 1;
				break;
			case "second":
				console.error("second interval not supported by Muse.JS interface. Defaulting to `minute` timescale");
				timeScale = period * 1;
				break;
			case "minute":
				timeScale = period * 1;
				break;
			case "hour":
				timeScale = period * 60;
				break;
			case "day":
				timeScale = period * 1440;
				break;
			case "week":
				timeScale = period * 10080;
				break;
			case "month":
				timeScale = period * 43200;
				break;
			default:
				console.error("Unknown interval.  Defaulting to minute");
				timeScale = period || 1;
		}
		return timeScale;
	};

	/**
	 * Converts date to ISO formatted string without milliseconds, per Muse.JS specification
	 * @param {date} date
	 * @returns {string}
	 * @private
	 */
	quoteFeedSunGard.toMuseDateString = function (date) {
		var maxDate = new Date(Math.max(0, new Date(date).getTime()));
		return CIQ.friendlyDate(maxDate).replace(/ /, "T").replace(/\//g, "-") + ":00";
	};

	quoteFeedSunGard.offsetMapping = {
		AMS: "CET",
		ARE: "Asia/Dubai",
		ATH: "CET",
		AUH: "Asia/Dubai",
		BKK: "Asia/Bangkok",
		BOM: "Asia/Kolkata",
		BRU: "CET",
		BUD: "CET",
		BUE: "America/Argentina/Buenos_Aires",
		CAI: "Africa/Cairo",
		CHI: "America/Chicago",
		DEL: "Asia/Kolkata",
		FFT: "CET",
		GMT: "UTC",
		HCM: "Asia/Bangkok",
		HKG: "Asia/Hong_Kong",
		IST: "Europe/Istanbul",
		JAK: "Asia/Bangkok",
		JHB: "Africa/Johannesburg",
		KUL: "Asia/Kuala_Lumpur",
		KWT: "Asia/Riyadh",
		LBN: "EET",
		LIS: "Europe/London",
		LON: "Europe/London",
		LUX: "CET",
		MAD: "CET",
		MEX: "America/Mexico_City",
		MIL: "CET",
		MNL: "Asia/Taipei",
		MON: "America/New_York",
		MOW: "Europe/Moscow",
		NYC: "America/New_York",
		PAR: "CET",
		PHL: "America/New_York",
		PRA: "CET",
		QAT: "Asia/Riyadh",
		SAO: "America/Sao_Paulo",
		SEL: "Asia/Seoul",
		SIN: "Asia/Kuala_Lumpur",
		STI: "America/Santiago",
		STO: "CET",
		SYD: "Australia/Sydney",
		TLV: "Asia/Jerusalem",
		TOK: "Asia/Tokyo",
		TOR: "America/New_York",
		TPE: "Asia/Taipei",
		VIE: "CET",
		WAR: "CET",
		WEL: "Pacific/Auckland",
		ZUR: "CET",
		FRX: "Africa/Johannesburg", //UTC+2 w/no DST
	};

	/**
	 * Static method to get time offset for the symbol
	 * @param {string} symbol				The symbol
	 * @returns {string} the offset in minutes from GMT of the symbol's market
	 * @memberOf quoteFeedSunGard
	 * @since 6.0.0
	 */
	quoteFeedSunGard.getTimeOffset = function (symbol) {
		var city = "NYC";
		if (symbol.indexOf("=") > -1) city = "FRX";
		else {
			if (symbol.indexOf(".") > -1) {
				var a = symbol.split(".");
				var suffix = a[a.length - 1];
				var pair = CIQ.ChartEngine.Driver.Lookup.SunGard.exchangeMapping[suffix];
				if (pair) city = pair[0];
			}
		}
		var tz = quoteFeedSunGard.offsetMapping[city];
		if (!tz) return 0;
		return new timezoneJS.Date(tz).getTimezoneOffset();
	};

	/**
	 * Event handler for connection state change from Muse.JS
	 * @param {object} data	-Muse.JS response object
	 */
	quoteFeedSunGard.onConnectionStateChanged = function (data) {
		console.log(data);
		if (data.Message.indexOf("new state: connected") > -1) {
			quoteFeedSunGard.isConnected = true;
			quoteFeedSunGard.connecting = false;
		} else quoteFeedSunGard.isConnected = false;
	};

	quoteFeedSunGard.loadDependencies = function (tryLater) {
		if (typeof muse != "object" && !this.loadingDependencies) {
			this.loadingDependencies = true;
			var dependencies = [
				"https://cdn.jsdelivr.net/npm/signalr@2.2.2/jquery.signalR.min.js",
				"https://www.marketmapmuse.com/MuseJS/muse.min.js",
				//'https://tbd3.marketmapmuse.com/MuseJS/muse.js'
			];
			if (
				!quoteFeedSunGard.museParams.group ||
				!quoteFeedSunGard.museParams.login ||
				!quoteFeedSunGard.museParams.password ||
				!quoteFeedSunGard.museParams.server
			) {
				dependencies.unshift(quoteFeedSunGard.museParams.credentialFile || "credential.js");
			}
			dependencies.forEach(function (src) {
				var script = document.createElement("script");
				script.src = src;
				script.async = false;
				document.head.appendChild(script);
			});
		}
		if (this.loadingDependencies) {
			if (typeof muse == "object") {
				if (CIQ.SG_Credential) {
					if (CIQ.SG_Credential.group) quoteFeedSunGard.museParams.group = CIQ.SG_Credential.group;
					if (CIQ.SG_Credential.login) quoteFeedSunGard.museParams.login = CIQ.SG_Credential.login;
					if (CIQ.SG_Credential.password) quoteFeedSunGard.museParams.password = CIQ.SG_Credential.password;
					if (CIQ.SG_Credential.server) quoteFeedSunGard.museParams.server = CIQ.SG_Credential.server;
				}
				if (!(quoteFeedSunGard.museParams.server instanceof Array))
					quoteFeedSunGard.museParams.server = [quoteFeedSunGard.museParams.server];
				this.loadingDependencies = false;
			} else setTimeout(tryLater, 50);
		}
	};

	quoteFeedSunGard.connectToMuse = function (onsuccess, onfail) {
		quoteFeedSunGard.connecting = true;
		function getEntitlements(result) {
			if (!result.isConnected) {
				quoteFeedSunGard.connecting = false;
				console.log(result.message);
				return;
			}
			function parseEntitlements(results, entitlement) {
				if (results) {
					results = results.split(":");
					if (results[1]) {
						results = results[1].split(";");
						for (var i = 0; i < results.length; i++) quoteFeedSunGard.entitlementMap[results[i]] = entitlement;
					}
				}
			}
			var reqID = (++quoteFeedSunGard.requestId).toString();
			var request = {};
			request[reqID] = {
				Symbol: "MARKETS.UMS",
				Fields: [5507, 5508, 5509, 5510],
			};
			if (quoteFeedSunGard.debug) console.log("monitor " + JSON.stringify(request));
			muse.monitorPrices(JSON.stringify(request), function (data) {
				if (quoteFeedSunGard.debug) console.log("stop monitoring " + reqID);
				muse.stopMonitorPrices(JSON.stringify({ Id: [parseInt(reqID, 10)] }));
				var results;
				if (data) {
					data = data[reqID];
					parseEntitlements(data[5508], "REAL-TIME");
					parseEntitlements(data[5509], "DELAYED");
					parseEntitlements(data[5510], "EOD");
				}
				quoteFeedSunGard.connecting = false;
				onsuccess({});
			});
		}
		var museParams = quoteFeedSunGard.museParams;
		muse
			.config({
				log: museParams.log || 0,
				servers: museParams.server,
			})
			.done(function () {
				muse.connectionStateChanged(quoteFeedSunGard.onConnectionStateChanged);
				muse.connect(museParams.group, museParams.login, museParams.password, getEntitlements);
			})
			.fail(function (response) {
				console.log("failed to connect");
				quoteFeedSunGard.connecting = false;
				if (onfail)
					onfail({
						error: response && response.message ? response.message : status,
					});
			});
	};

	/**
	 * Returns a date normalized to the SG database based on time zone the symbol trades.
	 * @param {date} time Time from quotefeed to normalize
	 * @param {string} symbol
	 * @return {*} normalized date
	 * @private
	 */
	quoteFeedSunGard.marketizeDate = function (time, symbol) {
		time = new Date(+time);
		return time.setMinutes(time.getMinutes() + time.getTimezoneOffset() - quoteFeedSunGard.getTimeOffset(symbol), 0, 0);
	};

	/**
	 * Handle data request from stxx and make request to Muse.JS
	 * @param {*} symbol
	 * @param {*} suggestedStartDate
	 * @param {*} suggestedEndDate
	 * @param {*} params
	 * @param {*} cb
	 * @private
	 */
	quoteFeedSunGard.handleDataRequest = function (symbol, suggestedStartDate, suggestedEndDate, params, cb, monitor) {
		function tryLater() {
			quoteFeedSunGard.handleDataRequest(symbol, suggestedStartDate, suggestedEndDate, params, cb, monitor);
		}
		quoteFeedSunGard.loadDependencies(tryLater);
		if (this.loadingDependencies) return;

		var stx = params.stx;

		// On the first data request, configure and connect Muse.JS
		if (quoteFeedSunGard.connecting) {
			setTimeout(tryLater, 500);
		} else if (!quoteFeedSunGard.isConnected) {
			quoteFeedSunGard.connectToMuse(onConnected, cb);
		} else {
			onConnected({});
		}

		function onConnected(data) {
			if (!data) return;

			// Prevent further connection attempts once established.
			quoteFeedSunGard.isConnected = data.isConnected !== false;

			if (!quoteFeedSunGard.isConnected) {
				if (cb) cb({ error: data.message });
				return;
			}

			function translateAndSendToChart(data, symbol, cb) {
				// The date which comes back is in the GMT time zone but reflects the actual date in the market time zone.
				// For example, a record for 12:00 PM EST for a stock will be stored as 12:00 GMT on the server.
				// We need to convert it to the actual GMT time it was when the market was at that time.
				var tzOffset = quoteFeedSunGard.getTimeOffset(symbol) * 60000;

				function arrayToQuote(dchlov) {
					var quoteObj = {
						DT: new Date(dchlov[0] * 1000 + tzOffset),
						Adj_Close: dchlov[1],
						Close: dchlov[1],
						High: dchlov[2],
						Low: dchlov[3],
						Open: dchlov[4],
						Volume: dchlov[5] || 0,
					};
					return quoteObj;
				}
				function moreData(moreData) {
					translateAndSendToChart(moreData, symbol, cb);
				}
				// keys of response item (data) determine success
				for (var i = 0, keys = Object.keys(data); i < keys.length; i++) {
					var key = keys[i];
					var val = data[key];
					if (key == "Errors") {
						cb({
							error: JSON.stringify(val),
						});
					} else if (val.Error) {
						cb({
							error: JSON.stringify(val.Error),
						});
					} else if (val.Data) {
						var quoteData = val.Data.map(arrayToQuote);

						//console.log("received data for:" + key);
						/*
						console.log(quoteData.length);
						console.log(quoteData);
						*/

						//get the table from the symbol
						var quoteTable = symbol.split(".");
						if (quoteTable.length == 1) {
							quoteTable = symbol.split("=");
							if (quoteTable.length > 1) quoteTable = "FX" + quoteTable[quoteTable.length - 1];
							else quoteTable = "";
						} else {
							quoteTable = quoteTable[quoteTable.length - 1];
						}

						cb({
							quotes: quoteData,
							moreAvailable: quoteData.length > 2,
							attribution: {
								source: "fis_mm",
								exchange: quoteFeedSunGard.entitlementMap[quoteTable],
							},
						}); // return the fetched data; init moreAvailable to enable pagination
					}
				}
			}

			try {
				var request = {
					// default to 'concise' output format, on which translateAndSendToChart depends
					OutputFormat: quoteFeedSunGard.museParams.outputFormat || 2,
				};

				var timeScale = quoteFeedSunGard.getMuseTimeScale(params.period, params.interval);

				// add item with key of auto-incrementing requestId
				var reqID = (++quoteFeedSunGard.requestId).toString();
				request[reqID] = {
					Symbol: symbol,
					// Fields: Volume: 71 Open: 73 Close: 74 High: 75 Low: 76
					// We order the fields in case data doesn't come back for Open or Volume
					Fields: [74, 75, 76, 73, 71],
					TimeScale: timeScale,
				};

				if (suggestedEndDate) {
					request[reqID].To = quoteFeedSunGard.toMuseDateString(suggestedEndDate);
				}
				if (suggestedStartDate) {
					request[reqID].From = quoteFeedSunGard.toMuseDateString(suggestedStartDate);
				}

				// request chart data from Muse.JS
				// Is all this code worth it?  Maybe just use polling to leverage all existing code in quoteFeed.updateChart
				if (monitor) {
					params.requestID = parseInt(reqID, 10);
					if (quoteFeedSunGard.debug) console.log("monitor " + JSON.stringify(request));
					muse.monitorCharts(JSON.stringify(request), function (data) {
						if (!stx.isHistoricalMode()) {
							translateAndSendToChart(data, symbol, function (quotes) {
								var qts = quotes.quotes;
								if (qts && qts.length) {
									qts = stx.quoteDriver.cleanup(stx, stx.chart, qts, CIQ.QuoteFeed.UPDATE, {
										symbol: symbol,
										chart: stx.chart,
									});
									//SG has bug, returns old data when monitoring.  Toss this response
									if (quoteFeedSunGard.marketizeDate(qts[qts.length - 1].DT, symbol) < suggestedStartDate) return;
									stx.updateChartData(qts, null, {
										secondarySeries: stx.chart.symbol == symbol ? null : symbol,
										noCleanupDates: true,
										noCreateDataSet: true,
									});
									stx.chart.attribution = quotes.attribution;
									if (stx.quoteDriver.behavior.callback) {
										stx.quoteDriver.behavior.callback(params);
									}
									stx.createDataSet(null, null, { appending: true });
									if (!params.nodraw) stx.draw();
								}
							});
						}
					});
				} else {
					if (quoteFeedSunGard.debug) console.log("snapshot " + JSON.stringify(request));
					muse.snapshotCharts(JSON.stringify(request), function (data) {
						translateAndSendToChart(data, symbol, cb);
					});
				}
			} catch (e) {
				quoteFeedSunGard.isConnected = false;
				console.log(e.message);
			}
		}
	};

	/**
	 * Calculate the best start date to use given SG quotefeed maxticks limitations
	 *
	 * @param {date} start
	 * @param {date} end
	 * @param {object} params
	 * @return {date} the startDate to use
	 * @private
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.getStartDateForSeries = function (start, end, params) {
		// Make sure span isn't too great, can happen with series data
		// tick data not supported, but keeping logic in here for consistency sake
		var iterator_parms = {
			begin: end,
			interval: params.interval,
			periodicity: params.interval == "tick" ? params.stx.chart.xAxis.futureTicksInterval : params.period,
		};
		var iterator = params.stx.chart.market.newIterator(iterator_parms);
		var maxStartDate = iterator.previous(quoteFeedSunGard.maxTicks);
		if (start < maxStartDate) return maxStartDate;
		return start;
	};

	/**
	 * Each of your quotefeed's "fetch..."" methods must call this callback to return data results to the chart.
	 *
	 * @callback quotefeed~dataCallback
	 * @param response
	 * @param {string} [response.error]            An error message, if one occurred.
	 * @param {array} [response.quotes]            An array of Quotes in required JSON format.
	 * @param {boolean} [response.moreAvailable]    Set this to false if you know that no older data is available (to stop pagination requests).
	 * @param {object} [response.attribution]        This object will be assigned to `stx.chart.attribution`. Your UI can use this to display attribution messages. See example.
	 *
	 * @example <caption>Returning quotes in the dataCallback object</caption>
	 * cb({quotes:[--array of quote elements here--]});
	 *
	 * @example <caption>Returning an error in the dataCallback object</caption>
	 * cb({error:"Your error message here"});
	 *
	 * @example <caption>Setting attribution through the dataCallback object</caption>
	 *
	 * // Set up a callback to be called whenever fetchInitialData is called
	 *  stxx.attachQuoteFeed(yourQuoteFeed, {callback: showAttribution});
	 *
	 * // after very data call, the attribution function will be called and you can then use it to display any message regarding the quote feed
	 function showAttribution(params){
		var message=params.stx.chart.attribution.message;
		// add your code here to display the message on your screen.
	}
	 *
	 * // In your quotefeed's fetchInitialData method, set the attribution object
	 * cb({quotes:[--array of quote elements here--], attribution:{message:"Data is delayed by 15 minutes"}});
	 */

	/**
	 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
	 *
	 * The charting engine calls this quotefeed function whenever the chart is wiped clean and created again with new data.
	 * This typically occurs when {@link CIQ.ChartEngine#loadChart} is called but can also occur from other methods such as {@link CIQ.ChartEngine#setPeriodicity}
	 * or {@link CIQ.ChartEngine#importLayout}.
	 *
	 * @param {string} symbol The ticker symbol of the data being fetched
	 * @param {date} suggestedStartDate A suggested starting date for the fetched data (based on how much can be displayed)
	 * @param {date} suggestedEndDate A suggested starting date for the fetched data (based on how much can be displayed)
	 * @param {object} params                        Provides additional information on the data requested by the chart.
	 * @param {boolean}    [params.series ]          If true then the request is for series/comparison data (i.e. not the the main symbol)
	 * @param {CIQ.ChartEngine} [params.stx]         The chart object requesting data
	 * @param {string} [params.symbolObject]         The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
	 * @param {number} [params.period]               The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} [params.interval]             The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @param {boolean} [params.fetchMaximumBars]    If set to true, the chart requires as much historical data as is available from the feed (params.ticks may also be set to 20,000 to set a safety max), regardless of start date. This is needed for some chart types since they aggregate data (kagi,renko, or linebreak, for example). Developers implementing fetch, should override params.tick and use a smaller number if their feed can't support that much data being sent back. The engine will then make multiple smaller calls to get enough data to fill the screen.
	 * @param {number} [params.ticks]                The suggested number of data points to return. This is calculated as twice the number of bars displayed on the chart. This can be used as an alternative to suggestedStartDate.
	 * @param {number} [params.timeout=10000]        This may be used to set the timeout in msec of the remote server request.
	 * @param  {function} cb            Call this function with the results (or error) of your data request.
	 * @since 6.0.0
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.fetchInitialData = function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
		//console.log("fetchInitialData");
		//console.log(arguments);
		// Make sure span isn't too great, can happen with span or series data
		if (params.startDate || params.series) {
			suggestedStartDate = quoteFeedSunGard.getStartDateForSeries(suggestedStartDate, suggestedEndDate, params);
		}
		var roundedStartDate = quoteFeedSunGard.marketizeDate(suggestedStartDate, symbol);
		var roundedEndDate = quoteFeedSunGard.marketizeDate(suggestedEndDate, symbol);
		quoteFeedSunGard.handleDataRequest(symbol, roundedStartDate, roundedEndDate, params, cb);
	};

	/**
	 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
	 *
	 * The charting engine calls this quotefeed function periodically (poll) to request updated data.
	 * The polling frequency is determined by the `refreshInterval` that you provided when you called {@link CIQ.ChartEngine#attachQuoteFeed}.
	 *
	 * @param {string} symbol The ticker symbol of the data being fetched
	 * @param {date} startDate The starting date for the fetched data (based on how much can be displayed)
	 * @param {object} params                        Provides additional information on the data requested by the chart.
	 * @param {boolean}    [params.series]             If true then the request is for series/comparison data (i.e. not the main symbol)
	 * @param {CIQ.ChartEngine} [arams.stx]           The chart object requesting data
	 * @param {string} [params.symbolObject]         The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
	 * @param {number} [params.period]               The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} [params.interval]             The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @param {number} [params.timeout=10000]        This may be used to set the timeout in msec of the remote server request.
	 * @param  {function} cb            Call this function with the results (or error) of your data request.
	 * @since 6.0.0
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.fetchUpdateData = function (symbol, startDate, params, cb) {
		//We'll fetch updates via the subscribe method
	};

	/**
	 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
	 *
	 * The charting engine calls this quotefeed function whenever the chart requires older data.
	 * Usually this is because a user has scrolled or zoomed past the end of the data.
	 * *Note: This method may be called during initial load if your fetchInitialData didn't provide enough data to fill the visible chart.*
	 *
	 * @param {string} symbol The ticker symbol of the data being fetched
	 * @param {date} suggestedStartDate A suggested starting data for the fetched data (based on how much can be displayed)
	 * @param {date} endDate The date of the last data point currently available in the chart. You should return data from this point and then backward in time.
	 * @param {object} params                        -Provides additional information on the data requested by the chart.
	 * @param {CIQ.ChartEngine} params.stx            -The chart object requesting data
	 * @param {string} [params.symbolObject]        -The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
	 * @param {number} params.period                -The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} params.interval                -The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @param {boolean} [params.fetchMaximumBars]    -If set to true, the chart requires as much historical data as is available from the feed (params.ticks may also be set to 20,000 to set a safety max), regardless of start date. This is needed for some chart types since they aggregate data (kagi,renko, or linebreak, for example). Developers implementing fetch, should override params.tick and use a smaller number if their feed can't support that much data being sent back. The engine will then make multiple smaller calls to get enough data to fill the screen.
	 * @param {number} params.ticks                -The suggested number of data points to return. This is calculated as twice the number of bars displayed on the chart. This can be used as an alternative to suggestedStartDate.
	 * @param {number} [params.timeout=10000]        -This may be used to set the timeout in msec of the remote server request.
	 * @param  {quoteFeedSunGard~dataCallback} cb            -Call this function with the results (or error) of your data request.
	 * @since 4.1.2 Added timeout parameter.
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.fetchPaginationData = function (symbol, suggestedStartDate, endDate, params, cb) {
		//console.log("fetchPaginationData");
		//console.log(arguments);
		if (params.stx.masterData.length) {
			if (params.startDate || params.series) {
				suggestedStartDate = quoteFeedSunGard.getStartDateForSeries(suggestedStartDate, endDate, params);
			}
			var roundedStartDate = quoteFeedSunGard.marketizeDate(suggestedStartDate, symbol);
			var roundedEndDate = quoteFeedSunGard.marketizeDate(endDate, symbol);
			quoteFeedSunGard.handleDataRequest(symbol, roundedStartDate, roundedEndDate, params, cb);
		} else {
			params.chart.loadingMore = false;
			if (cb) cb();
		}
	};

	/**
	 * See [Data Integration : Advanced]{@tutorial DataIntegrationAdvanced}
	 *
	 * Although not a core quotefeed function, the charting engine calls this optional function each time the chart encounters a new symbol or a particular periodicity for that symbol.
	 * This could happen when a user changes periodcity, changes a symbol, adds a comparison symbol, or a new study is added that requires an underlying symbol.
	 *
	 * Use this along with unsubscribe() to keep track of symbols on the chart.
	 * Use cases include: maintaining legends, lists of securities, or adding/removing subscriptions to streaming connections.
	 *
	 * If using a push stream, subscribe and then have the push streamer push updates using {@link CIQ.ChartEngine#appendMasterData}.
	 *
	 * @param {object} params						-Provides additional information on the data requested by the chart.
	 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
	 * @param {string} params.symbol 				-The symbol being added
	 * @param {string} params.symbolObject 			-The symbol being added in object form
	 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @memberOf quoteFeedSunGard
	 * @since 4.0.0 Changes to periodicity (period/interval) will now also cause subscribe calls
	 */
	quoteFeedSunGard.subscribe = function (params) {
		if (params.stx.quoteDriver.behavior.refreshInterval <= 0) return;
		//console.log("subscribe");
		//console.log(arguments);
		var iterator_parms = {
			begin: new Date(),
			interval: params.interval,
			periodicity: params.interval == "tick" ? params.stx.chart.xAxis.futureTicksInterval : params.period,
		};
		var iterator = params.stx.chart.market.newIterator(iterator_parms);
		var startDate = quoteFeedSunGard.marketizeDate(iterator.previous(), params.symbol);
		quoteFeedSunGard.handleDataRequest(params.symbol, startDate, undefined, params, function () {}, true);
	};

	/**
	 * See [Data Integration : Advanced]{@tutorial DataIntegrationAdvanced}
	 *
	 * Although not a core quotefeed function, the charting engine calls this optional function each time the chart no longer requires a symbol or a particular periodicity for that symbol.
	 *
	 * @param {object} params						Provides additional information on the data requested by the chart.
	 * @param {CIQ.ChartEngine} [params.stx] 		The chart object requesting data
	 * @param {string} [params.symbol]				The symbol being removed
	 * @param {string} [params.symbolObject] 		The symbol being removed in object form
	 * @param {number} [params.period] 				The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
	 * @param {string} [params.interval] 			The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
	 * @memberOf quoteFeedSunGard
	 * @since 6.0.0
	 */
	quoteFeedSunGard.unsubscribe = function (params) {
		if (params.requestID) {
			if (quoteFeedSunGard.debug) console.log("stop monitoring " + params.requestID);
			muse.stopMonitorCharts(JSON.stringify({ Id: [params.requestID] }));
		}
	};

	/**
	 * Retrieve a snapshot quote on one or more symbols
	 * @param {array} symbols Symbols to get a quote for
	 * @param {function} cb Callback upon results
	 * @memberOf quoteFeedSunGard
	 */
	quoteFeedSunGard.snapshotQuotes = function (symbols, cb) {
		function tryLater() {
			quoteFeedSunGard.snapshotQuotes(symbols, cb);
		}
		quoteFeedSunGard.loadDependencies(tryLater);
		if (quoteFeedSunGard.loadingDependencies) return;

		if (quoteFeedSunGard.connecting) {
			setTimeout(tryLater, 500);
		} else if (!quoteFeedSunGard.isConnected) {
			quoteFeedSunGard.connectToMuse(onConnected);
		} else {
			onConnected({});
		}

		function onConnected(data) {
			if (!data) return;

			// Prevent further connection attempts once established.
			quoteFeedSunGard.isConnected = data.isConnected !== false;

			if (!quoteFeedSunGard.isConnected) {
				return;
			}

			var request = {},
				quoteData = {},
				reqMap = {},
				doneCnt = 0;
			for (var i = 0; i < symbols.length; i++) {
				var cnt = ++quoteFeedSunGard.requestId;
				var req = (request[cnt.toString()] = {
					Symbol: symbols[i],
					Fields: [2, 304, 101, 109], // Last, PClose, Change, %Chg
				});
				reqMap[cnt] = symbols[i];
				quoteData[symbols[i]] = {};
			}

			function handleResponse(response) {
				//console.log("Received monitorPrices response");
				//console.log(response);
				var id = Object.keys(response);
				muse.stopMonitorPrices(JSON.stringify({ Id: id }));
				var results = [];
				function arrayToQuote(snapshot) {
					var fields = Object.keys(snapshot);
					var quoteObj = {
						Last: snapshot[fields[0]],
						PreviousClose: snapshot[fields[3]],
						Change: snapshot[fields[1]],
						PercentChange: snapshot[fields[2]],
					};
					return quoteObj;
				}

				var quote = arrayToQuote(response[id]);
				quoteData[reqMap[id]] = quote;
				doneCnt++;
				if (doneCnt == symbols.length) cb(quoteData);
			}
			try {
				if (quoteFeedSunGard.debug) console.log("monitor " + JSON.stringify(request));
				muse.monitorPrices(JSON.stringify(request), handleResponse);
			} catch (e) {
				quoteFeedSunGard.isConnected = false;
				console.log(e.message);
			}
		}
	};

	/**
	 * Class to perform symbol lookup
	 * @name CIQ.ChartEngine.Driver.Lookup.SunGard
	
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.SunGard = function (exchanges) {};

	CIQ.ChartEngine.Driver.Lookup.SunGard.ciqInheritsFrom(CIQ.ChartEngine.Driver.Lookup);

	CIQ.ChartEngine.Driver.Lookup.SunGard.exchangeMapping = {
		AS: ["AMS", "Amsterdam"],
		DFM: ["ARE", "Dubai"],
		ATH: ["ATH", "Athens"],
		ATI: ["ATH", "Athens"],
		ADS: ["AUH", "Abu Dhabi"],
		TH: ["BKK", "Bangkok"],
		BIN: ["BOM", "Bombay"],
		BS: ["BOM", "Bombay"],
		BSE: ["BOM", "Bombay"],
		NS: ["BOM", "NSE India"],
		BRU: ["BRU", "Brussels"],
		BUD: ["BUD", "Budapest"],
		SBA: ["BUE", "Buenos Aires"],
		EGX: ["CAI", "Cairo"],
		NSE: ["DEL", "NSE India"],
		EU: ["FFT", "Eurex"],
		F: ["FFT", "Frankfurt"],
		XE: ["FFT", "XETRA"],
		GST: ["FFT", "Stuttgart"],
		FTS: ["GMT", "FTSE"],
		HCM: ["HCM", "Ho Chih Minh"],
		HK: ["HKG", "Hong Kong"],
		HKI: ["HKG", "Hang Seng"],
		SH: ["HKG", "Shanghai"],
		SZ: ["HKG", "Shenzen"],
		ISE: ["IST", "Istanbul"],
		ISI: ["IST", "Istanbul"],
		JA: ["JAK", "Jakarta"],
		J: ["JHB", "Johannesburg"],
		JI: ["JHB", "Johannesburg"],
		KL: ["KUL", "Kuala Lumpur"],
		KUW: ["KWT", "Kuwait"],
		BRT: ["LBN", "Beirut"],
		LIS: ["LIS", "Lisbon"],
		CHX: ["LON", "Chi-X"],
		DUB: ["LON", "Dubai"],
		L: ["LON", "London"],
		LI: ["LON", "London"],
		LUX: ["LUX", "Luxembourg"],
		MAC: ["MAD", "Madrid"],
		MAI: ["MAD", "Madrid"],
		MX: ["MEX", "Mexican"],
		MI: ["MIL", "Milan"],
		PS: ["MNL", "Manila"],
		M: ["MON", "Montreal"],
		MCC: ["MOW", "Moscow"],
		MCS: ["MOW", "Moscow"],
		UX: ["MOW", "Ukraine"],
		A: ["NYC", "NYSEArca", 1],
		BATU: ["NYC", "BATS", 1],
		CE: ["NYC", "ICE"],
		CX: ["NYC", "COMEX"],
		N: ["NYC", "NYSE", 1],
		NX: ["NYC", "NYMEX"],
		O: ["NYC", "NASDAQ", 1],
		OB: ["NYC", "OTC"],
		OI: ["NYC", "OTC"],
		OIT: ["NYC", "Mutual Fund"],
		OMM: ["NYC", "Mutual Fund"],
		OMF: ["NYC", "Mutual Fund"],
		XC: ["NYC", "CBOE"],
		XDJ: ["NYC", "Dow Jones"],
		XNG: ["NYC", "NYSE"],
		XO: ["NYC", "NASDAQ"],
		XR: ["NYC", "Russell"],
		XX: ["CHI", "S&P"],
		OL: ["OSL", "Oslo"],
		EMI: ["PAR", "Paris"],
		ENX: ["PAR", "Paris"],
		PA: ["PAR", "Paris"],
		XH: ["PHL", "PHLX"],
		PRA: ["PRA", "Prague"],
		QE: ["QAT", "Qatar"],
		BOV: ["SAO", "Sao Paolo"],
		KOS: ["SEL", "KOSDAQ"],
		KS: ["SEL", "Korea"],
		SI: ["SIN", "Singapore"],
		SAN: ["STI", "Santiago"],
		OMI: ["STO", "Stockholm"],
		AX: ["SYD", "Australian"],
		TAE: ["TLV", "Tel Aviv"],
		T: ["TOK", "Tokyo"],
		TO: ["TOR", "TSX"],
		V: ["TOR", "TSX"],
		GTS: ["TPE", "Taiwan"],
		TAI: ["TPE", "Taiwan"],
		VIE: ["VIE", "Vienna"],
		WAI: ["WAR", "Warsaw"],
		NZ: ["WEL", "New Zealand"],
		S: ["ZUR", "Swiss"],
		STX: ["ZUR", "STOXX"],
		FOREX: ["FRX", "FX"],
	};

	/**
	 * @param {string} text Text to search for
	 * @param {string} filter Any filter to be applied to the search results
	 * @param {number} maxResults Max number of results to return from the server
	 * @param {function} cb Callback upon results
	 * @memberOf CIQ.ChartEngine.Driver.Lookup.SunGard
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.SunGard.prototype.acceptText = function (text, filter, maxResults, cb) {
		var self = this;
		function tryLater() {
			self.acceptText(text, filter, maxResults, cb);
		}
		quoteFeedSunGard.loadDependencies(tryLater);
		if (quoteFeedSunGard.loadingDependencies) return;

		if (quoteFeedSunGard.connecting) {
			setTimeout(tryLater, 500);
		} else if (!quoteFeedSunGard.isConnected) {
			quoteFeedSunGard.connectToMuse(onConnected);
		} else {
			onConnected({});
		}

		function onConnected(data) {
			if (!data) return;

			// Prevent further connection attempts once established.
			quoteFeedSunGard.isConnected = data.isConnected !== false;

			if (!quoteFeedSunGard.isConnected) {
				return;
			}

			var type = "-"; //invalid
			switch (filter) {
				case "FX":
				case "FOREX":
				case "CURRENCIES":
					type = "X";
					break;
				case "STOCKS":
					type = "S";
					break;
				case "FUNDS":
					type = "M";
					break;
				case "INDEXES":
					type = "I";
					break;
				case "FUTURES":
					type = "F";
					break;
				case "ALL":
				case null:
					type = null;
					break;
			}
			if (isNaN(parseInt(maxResults, 10))) maxResults = 100;
			var request = {};
			var cnt = ++quoteFeedSunGard.requestId;
			var req = (request[cnt.toString()] = {
				Search: text.toUpperCase(),
				SearchType: "BestMatch",
				MaxCount: maxResults,
				Fields: [0, 1],
			});
			if (type) req.Type = type;

			var self = this;
			function handleResponse(response) {
				//console.log("Received onSymbolsSearch response");
				//console.log(response);
				var results = [];
				for (var r in response) {
					if (r != cnt) return;
					var data = response[r];
					if (data.NbMatch) {
						for (var i = 0; i < data.Values.length; i++) {
							var fields = data.Values[i];
							var sym = fields[0];
							if (!sym) continue; // I saw an empty object in the response once
							var a;
							if (sym.indexOf("=") > -1) {
								a = sym.split("=");
								a[a.length - 1] = "FOREX";
							} else if (sym.indexOf(".") > -1) {
								a = sym.split(".");
							}
							var exch = CIQ.ChartEngine.Driver.Lookup.SunGard.exchangeMapping[a[a.length - 1]];
							if (exch) {
								if (exch[2]) sym = a.slice(0, a.length - 1).join(".");
								exch = exch[1];
							} else {
								exch = a[a.length - 1];
							}
							var item = {
								symbol: sym,
								name: fields[1],
								exchDisp: exch,
							};
							results.push({
								display: [item.symbol, item.name, item.exchDisp],
								data: item,
							});
						}
					}
				}
				cb(results);
			}
			try {
				if (quoteFeedSunGard.debug) console.log("monitor " + JSON.stringify(request));
				muse.monitorSymbolsSearch(JSON.stringify(request), handleResponse);
			} catch (e) {
				quoteFeedSunGard.isConnected = false;
				console.log(e.message);
			}
		}
	};

	/**
	 * Overriding function for SG
	 * @private
	 */
	CIQ.Market.Symbology.isFuturesSymbol = function (symbol) {
		if (!symbol) return false;
		if (symbol.indexOf(".") == -1) return false;
		var parts = symbol.split(".");
		switch (parts[parts.length - 1]) {
			case "CE":
			case "CE2":
			case "VIX":
			case "WC":
			case "WC2":
			case "PFCL":
			case "CX":
			case "NX":
				return true;
		}
		return false;
	};

	/**
	 * Overriding function for SG
	 * @private
	 */
	CIQ.Market.Symbology.isForeignSymbol = function (symbol) {
		if (!symbol) return false;
		if (symbol.indexOf(".") == -1) return false;
		var parts = symbol.split(".");
		switch (parts[parts.length - 1]) {
			case "N":
			case "O":
			case "OB":
			case "OI":
			case "A":
			case "OMM":
			case "OIT":
			case "XC":
			case "XDJ":
			case "XO":
			case "XNG":
			case "OMF":
			case "XR":
			case "XX":
				return false;
		}
		return true;
	};

	/**
	 * Overriding function for SG
	 * @private
	 */
	CIQ.Market.Symbology.isForexSymbol = function (symbol) {
		if (!symbol) return false;
		if (symbol.indexOf("=") > -1) return true;
		return false;
	};

	/**
	 * Overriding function for SG
	 * @private
	 */
	CIQ.Market.Symbology.factory = function (symbolObject) {
		var symbol = symbolObject.symbol;
		var a = symbol.split(".");
		var suffix = a[a.length - 1];
		if (CIQ.Market.Symbology.isForeignSymbol(symbol)) {
			if (suffix == "L") return CIQ.Market.LSE;
			return null;
		}
		if (CIQ.Market.Symbology.isFuturesSymbol(symbol)) return CIQ.Market.GLOBEX;
		if (CIQ.Market.Symbology.isForexMetal(symbol)) return CIQ.Market.METALS;
		if (CIQ.Market.Symbology.isForexSymbol(symbol)) return CIQ.Market.FOREX;
		return CIQ.Market.NYSE;
	};

	return _exports;
});
