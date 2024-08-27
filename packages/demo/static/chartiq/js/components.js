/* eslint-disable no-undef */
//-------------------------------------------------------------------------------------------
// Copyright 2012-2019 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------
(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["componentUI"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("componentUI"));
	} else {
		factory(root);
	}
})(this, function (_exports) {
	var CIQ = _exports.CIQ;

	/**
	 * Show Range web component `<cq-show-range>`.
	 *
	 * @namespace WebComponents.cq-show-range
	 * @example
	 	 <cq-show-range>
 			<div stxtap="set(1,'today');">1d</div>
 			<div stxtap="set(5,'day',30,2,'minute');">5d</div>
 			<div stxtap="set(1,'month',30,8,'minute');">1m</div>
 			<div class="hide-sm" stxtap="set(3,'month');">3m</div>
 			<div class="hide-sm" stxtap="set(6,'month');">6m</div>
 			<div class="hide-sm" stxtap="set(1,'YTD');">YTD</div>
 			<div stxtap="set(1,'year');">1y</div>
 			<div class="hide-sm" stxtap="set(5,'year',1,1,'week');">5y</div>
 			<div class="hide-sm" stxtap="set(1,'all',1,1,'month');">All</div>
 	   </cq-show-range>
	 */
	class ShowRange extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		/**
		 * Proxies UI requests for span changes to the chart engine.
		 *
		 * Usage Examples:
		 * - `set(5,'day',30,2,'minute')` means that you want to combine two 30-minute bars into a single candle.
		 *   - So your quote feed must return one data object for every 30 minutes. A total of 2 data points per hour.
		 * - `set(5,'day',2,30,'minute')` means that you want to combine thirty 2-minute bars into a single candle.
		 *   - So your quote feed must return one data object for every 2 minutes. A total of 30 data points per hour.
		 * - `set(5,'day', 1, 60,'minute')` means that you want to combine sixty 1-minute bars into a single candle.
		 *   - So your quote feed must return one data object for every minute . A total of 60 data points per hour.
		 * - `set(5,'day', 60, 1,'minute')` means that you want to have a single 60 minute bar per period.
		 *   - So your quote feed must return one data object for every 60 minutes . A total of 1 data point per hour.
		 *
		 * @param {Object} activator Activation information
		 * @param {Number} multiplier   The period that will be passed to {@link CIQ.ChartEngine#setSpan}
		 * @param {Number} base The interval that will be passed to {@link CIQ.ChartEngine#setSpan}
		 * @param {Number} [interval] Chart interval to use (leave empty for autodetect)
		 * @param {Number} [period] Chart period to use (leave empty for autodetect)
		 * @param {Number} [timeUnit] Chart timeUnit to use (leave empty for autodetect)
		 * @alias set
		 * @memberof WebComponents.cq-show-range
		 * @since 5.1.1 timeUnit added
		 */
		set(activator, multiplier, base, interval, period, timeUnit) {
			var self = this;
			if (self.context.loader) self.context.loader.show();
			var params = {
				multiplier: multiplier,
				base: base,
			};
			if (interval) {
				params.periodicity = {
					interval: interval,
					period: period ? period : 1,
					timeUnit: timeUnit,
				};
			}
			self.context.stx.setSpan(params, function () {
				if (self.context.loader) self.context.loader.hide();
			});
		}
	}

	CIQ.UI.ShowRange = ShowRange;
	customElements.define("cq-show-range", ShowRange);

	/**
	 * Advertisement web component `<cq-advertisement>`.
	 *
	 * Displays an advertisement banner as a "marker" (inside the chart, use CSS to position absolutely against the chart panel).
	 * The advertisement should contain content that can be enabled by calling {@link CIQ.UI.Advertisement#show} based on your
	 * business logic.
	 *
	 * The advertisement will automatically adjust the height to accommodate the content (assuming overflow-y: auto)
	 * @namespace WebComponents.cq-advertisement
	 * @example
		<cq-advertisement style="display: block; height: 106px;">
		    <cq-close class="ciq-tight"></cq-close>
			<div class="sample ciq-show">
				<div cq-desktop="">
					<div><translate original="$1 Trades">$1 Trades</translate></div>
					<div><translate original="Use code ">Use code </translate><strong><translate original="Sample">Sample</translate></strong></div>
					<a target="_blank" href="https://yourURL?codeSample&desktop"><translate original="Click to learn more">Click to learn more</translate></a>
				</div>
				<div cq-phone="">
					<div><translate original="$1 Trades">$1 Trades</translate></div>
					<a target="_blank" href="https://yourURL?codeSample&mobile"><translate original="Click to learn more">Click to learn more</translate></a>
				</div>
			</div>
		</cq-advertisement>
	 *
	 */
	class Advertisement extends CIQ.UI.ModalTag {
		constructor() {
			super();
			this.nameValueStore = new CIQ.NameValueStore();
		}

		/**
		 * Hides the advertisement and suppresses it for 24 hours by storing it in local storage.
		 * If the selector itself changes however then the ad will reappear.
		 * @memberof WebComponents.cq-advertisement
		 */
		close() {
			this.node.css({ display: "none" });
			var self = this;
			this.nameValueStore.get("cq-advertisement", function (err, ls) {
				if (err) return;
				var future = new Date();
				if (!self.sleepAmount) self.sleepAmount = { units: 1, unitType: "day" };
				var u = self.sleepAmount.units;
				var ut = self.sleepAmount.unitType;
				if (ut == "minute") future.setMinutes(future.getMinutes() + u);
				else if (ut == "hour") future.setHours(future.getHours() + u);
				else if (ut == "day") future.setDate(future.getDate() + u);
				else if (ut == "week") future.setDate(future.getDate() + u * 7);
				else if (ut == "month") future.setMonth(future.getMonth() + u);
				var ms = future.getTime();
				if (!ls || typeof ls != "object") ls = {};
				ls[self.selector] = ms;
				self.nameValueStore.set("cq-advertisement", ls);
			});
		}

		makeMarker() {
			if (this.markerExists) return;
			new CIQ.Marker({
				stx: this.context.stx,
				xPositioner: "none",
				label: "advertisement",
				permanent: true,
				node: this.node[0],
			});
			this.markerExists = true;
		}

		setNameValueStore(nameValueStore) {
			this.nameValueStore = nameValueStore;
		}

		/**
		 * Sets the sleep time for this amount of time before re-displaying
		 * @param  {Number} units    Units
		 * @param  {string} unitType Unit type. Value values "minute","hour","day","week"
		 * @memberof WebComponents.cq-advertisement
		 */
		setSleepAmount(units, unitType) {
			this.sleepAmount = {
				units: units,
				unitType: unitType,
			};
		}

		/**
		 * Show the advertisement. This should be a div inside of the web component.
		 * @param  {Selector} [selector]    A selector. If none specified then the first div will be selected.
		 * @param  {Boolean} [ignoreSleep=false] If true then ignore sleep
		 * @member! CIQ.UI.Advertisement
		 */
		show(selector, ignoreSleep) {
			if (this.selector) {
				var priorContent = this.node.find(this.selector);
				priorContent.removeClass("ciq-show");
			}
			this.selector = selector;
			if (!this.selector) {
				var div = this.node.find("div:first-of-type");
				this.selector = "." + div.attr("class");
			}
			this.ignoreSleep = ignoreSleep;
			var self = this;
			function doIt() {
				self.makeMarker();
				self.node.css({ display: "block" });
				var content = self.node.find(self.selector);
				content.addClass("ciq-show");

				// resize content
				self.node.css({ height: "0px" });
				setTimeout(function () {
					self.node.css({ height: self.node[0].scrollHeight + "px" });
				}, 0);
			}
			if (!ignoreSleep) {
				this.nameValueStore.get("cq-advertisement", function (err, ls) {
					if (err) return;
					if (!ls || typeof ls != "object") ls = {};
					var ms = ls[self.selector];
					if (ms && ms > Date.now()) return; // still surpressed
					doIt();
				});
			} else {
				doIt();
			}
		}

		/**
		 * Call this to force the advertisement to monitor the nameValueStore for updates. It will do this by
		 * polling. This is useful when running in multiple windows, do that if the advertisement is closed in one
		 * window then it will automatically close in the other windows.
		 * @param {Number} [ms=1000] Number of milliseconds to poll.
		 * @memberof WebComponents.cq-advertisement
		 */
		watchForRemoteClose(ms) {
			if (!ms) ms = 1000;
			var self = this;
			setInterval(function () {
				if (self.node.css("display") == "none") return; // already closed, do nothing
				self.nameValueStore.get("cq-advertisement", function (err, ls) {
					if (err) return;
					if (!ls || typeof ls != "object") ls = {};
					var ms = ls[self.selector];
					if (ms && ms > Date.now()) self.close();
				});
			}, ms);
		}
	}

	CIQ.UI.Advertisement = Advertisement;
	customElements.define("cq-advertisement", Advertisement);

	/**
	 * Attribution web component `<cq-attribution>`.
	 *
	 * This will put a node inside a panel to attribute the data.
	 * Both the main chart panel (for quotes) and a study panel can use an attribution.
	 *
	 * @namespace WebComponents.cq-attribution
	 * @since 2016-07-16
	 * @example
	 * <cq-attribution>
	 * 	<template>
	 * 		<cq-attrib-container>
	 * 			<cq-attrib-source></cq-attrib-source>
	 * 			<cq-attrib-quote-type></cq-attrib-quote-type>
	 * 		</cq-attrib-container>
	 * 	</template>
	 * </cq-attribution>
	 */
	class Attribution extends CIQ.UI.ModalTag {
		constructor() {
			super();
			/**
			 * Here is where the messages go.  This could be supplemented, overridden, etc. by the developer.
			 * The sources contain properties whose values which go into <cq-attrib-source>.
			 * The exchanges contain properties whose values which go into <cq-attrib-quote-type>.
			 *
			 * For quotes, the sources would match the quote source.  For a study, it would match the study type.
			 * If there is no matching property, the appropriate component will have no text.
			 * @alias messages
			 * @memberof WebComponents.cq-attribution
			 */
			this.messages = {
				sources: {
					simulator: "Simulated data.",
					demo: "Demo data.",
					xignite: '<a target="_blank" href="https://www.xignite.com">Market Data</a> by Xignite.',
					fis_mm: '<a target="_blank" href="https://www.fisglobal.com/">Market Data</a> by FIS MarketMap.',
					Twiggs:
						'Formula courtesy <a target="_blank" href="https://www.incrediblecharts.com/indicators/twiggs_money_flow.php">IncredibleCharts</a>.',
				},
				exchanges: {
					RANDOM: "Data is randomized.",
					"REAL-TIME": "Data is real-time.",
					DELAYED: "Data delayed 15 min.",
					BATS: "BATS BZX real-time.",
					EOD: "End of day data.",
				},
			};
		}

		insert(stx, panel) {
			var attrib = CIQ.UI.makeFromTemplate(this.template);
			new CIQ.Marker({
				stx: stx,
				node: attrib[0],
				xPositioner: "none",
				yPositioner: "none",
				label: "attribution",
				panelName: panel,
			});
			return attrib;
		}

		setContext(context) {
			this.template = this.node.find("template");
			var chartAttrib = this.insert(context.stx, "chart");
			var self = this;
			this.addInjection("append", "createDataSet", function () {
				var source, exchange;
				if (this.chart.attribution) {
					source = self.messages.sources[this.chart.attribution.source];
					exchange = self.messages.exchanges[this.chart.attribution.exchange];
					if (!source) source = "";
					if (!exchange) exchange = "";
					if (source + exchange != chartAttrib.attr("lastAttrib")) {
						chartAttrib.find("cq-attrib-source").html(source);
						chartAttrib.find("cq-attrib-quote-type").html(exchange);
						CIQ.I18N.translateUI(null, chartAttrib[0]);
						chartAttrib.attr("lastAttrib", source + exchange);
					}
				}
				outer: for (var study in this.layout.studies) {
					var type = this.layout.studies[study].type;
					if (self.messages.sources[type]) {
						for (var i = 0; i < this.markers.attribution.length; i++) {
							if (this.markers.attribution[i].params.panelName == this.layout.studies[study].panel) continue outer;
						}
						if (!this.panels[study]) continue;
						source = self.messages.sources[type];
						exchange = self.messages.exchanges[type];
						if (!source) source = "";
						if (!exchange) exchange = "";
						var attrib = self.insert(this, study);
						attrib.find("cq-attrib-source").html(source);
						attrib.find("cq-attrib-quote-type").html(exchange);
						CIQ.I18N.translateUI(null, attrib[0]);
					}
				}
			});
		}
	}

	CIQ.UI.Attribution = Attribution;
	customElements.define("cq-attribution", Attribution);

	class ChartIQChart extends HTMLElement {
		get config() {
			return JSON.parse(this.getAttribute("chart-constructor"));
		}

		get defer() {
			return JSON.parse(this.getAttribute("defer-start"));
		}

		get drawingToolbar() {
			return JSON.parse(this.getAttribute("toolbar-active"));
		}

		constructor() {
			super();
		}

		connectedCallback() {
			if (this.defer) return;
			let config = Object.assign({ container: document.querySelector(".chartContainer") }, this.config);
			if (this.preferences) config.preferences = this.preferences;
			this.stx = new CIQ.ChartEngine(config);

			this.startChart();
		}

		disconnectedCallback() {
			this.stx.destroy();
		}

		/**
		 * Main method to start the charts addOns, plugins, etc.
		 * By default will be called on the connected callback unless defer-start attribute is set to true.
		 * Should be called by another function to start the chart.
		 *
		 * Expects a copy of the engine to be saved to this element.
		 */
		startChart(engine, feed, behavior) {
			if (!this.stx) this.stx = engine;
			if (!this.stx)
				throw new Error("no CIQ.ChartEngine created!\nDouble check that you have passed an engine into this function.");
			this.configureDataSource(feed, behavior);
			this.configureMarkets();
			this.configureAddOns();
			this.startUI();
		}

		/**
		 * Overwrite me to extend and attach your own quoteFeed.
		 * This function should call CIQ.ChartEngine#attachQuoteFeed with the quoteFeed you wish to use or start streaming your data.
		 */
		configureDataSource(feed, behavior) {
			if (feed) this.stx.attachQuoteFeed(feed, behavior);
			else this.stx.attachQuoteFeed(quoteFeedSimulator, { refreshInterval: 1 });
		}

		/**
		 * Overwrite me to extend and start your own custom chart UI here.
		 * Called by the connectedCallback so you are garuenteed to have access to the DOM. Initialize anything you need for your UI here.
		 */
		startUI() {
			this.setHeight();
			this.startComponentUI();
		}

		/**
		 * Overwrite me to set up your chart with custom market classes.
		 */
		configureMarkets() {
			this.stx.setMarketFactory(CIQ.Market.Symbology.factory);
		}

		configureAddOns() {
			if (CIQ.RangeSlider) {
				new CIQ.RangeSlider({ stx: this.stx });
			}
			if (CIQ.Animation) {
				new CIQ.Animation(this.stx, { tension: 0.3 });
			}
			if (CIQ.ExtendedHours) {
				new CIQ.ExtendedHours({ stx: this.stx, filter: true });
			}
			if (CIQ.InactivityTimer) {
				this.inactivityTimer = new CIQ.InactivityTimer({
					stx: this.stx,
					minutes: 30,
				});
			}
			if (CIQ.Tooltip) {
				new CIQ.Tooltip({
					stx: this.stx,
					ohl: true,
					volume: true,
					series: true,
					studies: true,
				});
			}
		}

		startComponentUI() {
			var stx = this.stx;
			var UIContext = CIQ.UI.getMyContext(stx.container);
			if (!UIContext) {
				UIContext = new CIQ.UI.Context(this.stx, document.querySelector("cq-context, [cq-context]"));
			}
			UIContext.stx = this.stx;

			var UIStudyEdit = new CIQ.UI.StudyEdit(null, UIContext);

			var KeystrokeHub = new CIQ.UI.KeystrokeHub(document.querySelector("body"), UIContext, {
				cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
			});

			if (UIContext.loader) UIContext.loader.show();
			if (CIQ.I18N.wordlists) CIQ.I18N.localize(stx, stx.preferences.language);

			this.restoreLayout(stx, function () {
				if (UIContext.loader) UIContext.loader.hide();
			});
			this.restorePreferences(stx);

			stx.addEventListener("layout", this.saveLayout);
			stx.addEventListener("symbolChange", this.saveLayout);
			stx.addEventListener("preferences", this.savePreferences);
			stx.addEventListener("newChart", this.retoggleEvents);
			stx.addEventListener("drawing", this.saveDrawings);
		}

		restoreLayout(stx, cb) {
			var datum = CIQ.localStorage.getItem("myChartLayout");
			if (datum === null) return;
			stx.importLayout(JSON.parse(datum), { managePeriodicity: true, cb: cb });
		}

		saveLayout(obj) {
			var s = JSON.stringify(obj.stx.exportLayout(true));
			CIQ.localStorageSetItem("myChartLayout", s);
		}

		restorePreferences(stx) {
			var pref = CIQ.localStorage.getItem("myChartPreferences");
			if (pref) stx.importPreferences(JSON.parse(pref));
		}

		savePreferences(obj) {
			CIQ.localStorageSetItem("myChartPreferences", JSON.stringify(obj.stx.exportPreferences()));
		}

		retoggleEvents(obj) {
			var active = document.querySelector(".stx-markers .ciq-radio.ciq-active");
			if (active) CIQ.UI.BaseComponent.activate(active.parentElement);
		}

		saveDrawings(obj) {
			var tmp = obj.stx.exportDrawings();
			if (tmp.length === 0) {
				CIQ.localStorage.removeItem(obj.symbol);
			} else {
				CIQ.localStorageSetItem(obj.symbol, JSON.stringify(tmp));
			}
		}

		restoreDrawings(stx, symbol) {
			var memory = CIQ.localStorage.getItem(symbol);
			if (memory) {
				var parsed = JSON.parse(memory);
				if (parsed) {
					stx.importDrawings(parsed);
					stx.draw();
				}
			}
		}

		showMarkers(type) {
			this.hideMarkers();
			this.createSampleEvents(type);
			this.stx.draw();
		}

		hideMarkers() {
			CIQ.Marker.removeByLabel(this.stx, "circle");
			CIQ.Marker.removeByLabel(this.stx, "square");
			CIQ.Marker.removeByLabel(this.stx, "callout");
			CIQ.Marker.removeByLabel(this.stx, "helicopter");
		}

		createSampleEvents(standardType) {
			let stx = this.stx;
			var l = stx.masterData.length;
			// An example of a data array to drive the marker creation
			var data = [];
			if (l >= 5)
				data.push({
					x: stx.masterData[l - 5].DT,
					type: standardType,
					category: "news",
					headline: "This is a Marker for a News Item",
				});
			if (l >= 15)
				data.push({
					x: stx.masterData[l - 15].DT,
					type: standardType,
					category: "earningsUp",
					headline: "This is a Marker for Earnings (+)",
				});
			if (l >= 25)
				data.push({
					x: stx.masterData[l - 25].DT,
					type: standardType,
					category: "earningsDown",
					headline: "This is a Marker for Earnings (-)",
				});
			if (l >= 35)
				data.push({
					x: stx.masterData[l - 35].DT,
					type: standardType,
					category: "dividend",
					headline: "This is a Marker for Dividends",
				});
			if (l >= 45)
				data.push({
					x: stx.masterData[l - 45].DT,
					type: standardType,
					category: "filing",
					headline: "This is a Marker for a Filing",
				});
			if (l >= 55)
				data.push({
					x: stx.masterData[l - 55].DT,
					type: standardType,
					category: "split",
					headline: "This is a Marker for a Split",
				});

			var story =
				"Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";

			// Loop through the data and create markers
			for (var i = 0; i < data.length; i++) {
				var datum = data[i];
				datum.story = story;
				var params = {
					stx: stx,
					label: standardType,
					xPositioner: "date",
					x: datum.x,
					//chartContainer: true, // Allow markers to float out of chart. Set css .stx-marker{ z-index:20}
					node: new CIQ.Marker.Simple(datum),
				};

				var marker = new CIQ.Marker(params);
			}
		}

		setHeight() {
			var windowHeight = window.innerHeight;
			var ciqHeight = document.querySelector(".ciq-chart").clientHeight;

			if (this.drawingToolbar) {
				this.style.height = ciqHeight - 45 + "px";
			} else {
				this.style.height = ciqHeight + "px";
			}
		}
	}

	CIQ.UI.ChartIQChart = ChartIQChart;
	customElements.define("chartiq-chart", ChartIQChart);

	/**
	 * Chart Title web component `<cq-chart-title>`.
	 *
	 * Note, if the `cq-marker` is added to the element, and it is placed within the
	 * chartArea, the element will sit above the chart bars.
	 *
	 * `<cq-symbol></cq-symbol>` will display the raw symbol for the chart (`chart.symbol`).<br>
	 * `<cq-symbol-description></cq-symbol-description>` will display the `chart.symbolDisplay`. See {@link CIQ.ChartEngine.Chart#symbolDisplay} for details on how to set this value.
	 *
	 * Set attribute "cq-browser-tab" to true in order to get the stock symbol and latest price to update in the browser tab.
	 *
	 * Set member previousClose to the prior day's closing price in order to calculate and display change.
	 * If previousClose is not set, then iqPrevClose from the dataSet will be the default
	 *
	 * @namespace WebComponents.cq-chart-title
	 * @example
	 * <cq-chart-title>
	 * 	<cq-symbol></cq-symbol>
	 * 	<cq-chart-price>
	 * 		<cq-current-price></cq-current-price>
	 * 		<cq-change>
	 * 			<div class="ico"></div> <cq-todays-change></cq-todays-change> (<cq-todays-change-pct></cq-todays-change-pct>)
	 * 		</cq-change>
	 * 	</cq-chart-price>
	 * </cq-chart-title>
	 *
	 * @example
	 * //You can set a more descriptive name by using http://documentation.chartiq.com/CIQ.ChartEngine.Chart.html#symbolDisplay
	 * // and then enabling that on the tile.
	 *
	 * //In your HTML file look for:
	 * <cq-symbol></cq-symbol>
	 * //and replace it with :
	 * <cq-symbol-description></cq-symbol-description>
	 *
	 * //In your quote feed add the following line:
	 * params.stx.chart.symbolDisplay=response.fullName;
	 *
	 * //Like so:
	 * quotefeed.fetchInitialData=function (symbol, suggestedStartDate, suggestedEndDate, params, cb) {
	 *  var queryUrl = this.url; // using filter:true for after hours
	 *
	 *  CIQ.postAjax(queryUrl, null, function(status, response){
	 *   // process the HTTP response from the datafeed
	 *   if(status==200){ // if successful response from datafeed
	 *    params.stx.chart.symbolDisplay=response.fullName; // specify response name
	 *    var newQuotes = quotefeed.formatChartData(response);
	 *    cb({quotes:newQuotes, moreAvailable:true, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
	 *   } else { // else error response from datafeed
	 *    cb({error:(response?response:status)});	// specify error in callback
	 *   }
	 *  });
	 * };
	 * @since  4.0.0
	 * Browser tab now updates with stock symbol and latest price using cq-browser-tab attribute
	 * @since
	 * <br>&bull; 06-15-16
	 * <br>&bull; 4.0.0 Browser tab now updates with stock symbol and latest price using cq-browser-tab attribute.
	 * <br>&bull; 6.3.0 Negative close values are "N/A" change percentage.
	 * <br>&bull; 6.3.0 Child tag `<cq-todays-change-pct>` is now optional.
	 */
	class ChartTitle extends CIQ.UI.ModalTag {
		constructor() {
			super();
			/**
			 * Keep this value up to date in order to calculate change from yesterday's close
			 * @type {Float}
			 * @alias previousClose
			 * @memberof WebComponents.cq-chart-title
			 */
			this.previousClose = null;
		}

		/**
		 * Begins the Title helper. This observes the chart and updates the title elements as necessary.
		 * @alias begin
		 * @memberof WebComponents.cq-chart-title
		 */
		begin() {
			var self = this;
			this.addInjection("append", "createDataSet", function () {
				self.update();
			});
			this.update();
		}

		initialize(params) {
			this.params = params ? params : {};
			if (typeof this.params.autoStart == "undefined") this.params.autoStart = true;
			this.marker = null;

			if (this.params.autoStart) this.begin();
		}

		setContext(context) {
			var self = this;
			CIQ.UI.observe({
				obj: self.context.stx.chart,
				member: "symbolObject",
				action: "callback",
				value: function () {
					if (self.context.stx.currentQuote()) self.previousClose = self.context.stx.currentQuote().iqPrevClose;
				},
			});
			this.initialize();
		}

		/**
		 * Updates the values in the node
		 * @alias update
		 * @memberof WebComponents.cq-chart-title
		 */
		update() {
			var stx = this.context.stx;

			var node = $(this);
			if (stx.chart.dataSet && stx.chart.dataSet.length) node.addClass("stx-show");
			else node.removeClass("stx-show");
			var symbolDiv = node.find("cq-symbol");
			var symbolDescriptionDiv = node.find("cq-symbol-description");
			var currentPriceDiv = node.find("cq-current-price");
			var todaysChangeDiv = node.find("cq-todays-change");
			var todaysChangePctDiv = node.find("cq-todays-change-pct");
			var chartPriceDiv = node.find("cq-chart-price");
			var changeDiv = node.find("cq-change");
			var doUpdateBrowserTab = this.node.truthyAttr("cq-browser-tab");
			var doUpdatePrice = chartPriceDiv.length;
			var symbol = stx.chart.symbol,
				symbolDisplay = stx.chart.symbolDisplay;
			var internationalizer = stx.internationalizer;
			var priceChanged = false;

			symbolDiv.textBetter(symbol);

			if (stx.isHistoricalModeSet) {
				currentPriceDiv.textBetter("");
				changeDiv.css({ display: "none" });
				// only change the display so that you don't wreck the line spacing and parens
				return;
			}

			var todaysChange = "",
				todaysChangePct = 0,
				todaysChangeDisplay = "",
				currentPrice = "";
			var currentQuote = stx.currentQuote();
			currentPrice = currentQuote ? currentQuote.Close : "";
			if (currentPrice && doUpdatePrice) {
				var oldPrice = parseFloat(currentPriceDiv.text());
				if (currentPriceDiv.textBetter(stx.formatYAxisPrice(currentPrice, stx.chart.panel))) {
					priceChanged = true;
					if (typeof currentPriceDiv.attr("cq-animate") != "undefined") {
						CIQ.UI.animatePrice(currentPriceDiv, currentPrice, oldPrice);
					}
				}
			}

			symbolDescriptionDiv.textBetter(symbolDisplay ? symbolDisplay : symbol);

			if ((doUpdatePrice || doUpdateBrowserTab) && symbol && priceChanged) {
				// Default to iqPrevClose if the developer hasn't set this.previousClose
				var previousClose = this.previousClose ? this.previousClose : currentQuote ? currentQuote.iqPrevClose : null;

				if (currentQuote && previousClose) {
					todaysChange = CIQ.fixPrice(currentQuote.Close - previousClose);
					todaysChangePct = (todaysChange / previousClose) * 100;
					if (previousClose <= 0 || currentQuote.Close < 0) {
						todaysChangeDisplay = "N/A";
					} else if (internationalizer) {
						todaysChangeDisplay = internationalizer.percent2.format(todaysChangePct / 100);
					} else {
						todaysChangeDisplay = todaysChangePct.toFixed(2) + "%";
					}
					changeDiv.css({ display: "block" });
				} else {
					changeDiv.css({ display: "none" });
				}
				var todaysChangeAbs = Math.abs(todaysChange);
				if (todaysChangeAbs) {
					todaysChangeDiv.textBetter(stx.formatYAxisPrice(todaysChangeAbs, stx.chart.panel));
				}
				if (todaysChangePctDiv.length) {
					todaysChangePctDiv.textBetter(todaysChangeDisplay);
				}
				if (todaysChangeDisplay !== "" && todaysChange > 0) {
					chartPriceDiv.removeClass("stx-down").addClass("stx-up");
				} else if (todaysChangeDisplay !== "" && todaysChange < 0) {
					chartPriceDiv.removeClass("stx-up").addClass("stx-down");
				} else {
					chartPriceDiv.removeClass("stx-down").removeClass("stx-up");
				}

				// These strange characters create some spacing so that the title appears
				// correctly in a browser tab
				this.title = symbol + " \u200b \u200b " + currentPrice + " \u200b \u200b \u200b ";
				if (todaysChange > 0) {
					this.title += "\u25b2 " + todaysChangeAbs;
				} else if (todaysChange < 0) {
					this.title += "\u25bc " + todaysChangeAbs;
				}
				if (doUpdateBrowserTab) {
					document.title = this.title;
				}
			}
		}
	}

	CIQ.UI.ChartTitle = ChartTitle;
	customElements.define("cq-chart-title", ChartTitle);

	/**
	 * clickable web component `<cq-clickable>`. When tapped/clicked this component can run a method on any
	 * other component. Set cq-selector attribute to a selector for the other component. Set cq-method
	 * to the method to run on that component. The parameter to the method will be an object that contains
	 * the context for this clickable (if available) and a reference to this button ("caller").
	 *
	 * @namespace WebComponents.cq-clickable
	 * @example
	 * <cq-clickable cq-selector="cq-sample-dialog" cq-method="open">Settings</span></cq-clickable>
	 * runs
	 * $("cq-sample-dialog")[0].open({context: this.context, caller: this});
	 * @since 3.0.9
	 */
	class Clickable extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			var self = this;

			$(this).stxtap(function () {
				self.runMethod();
			});
		}

		/**
		 * Runs the clickable
		 * @memberof WebComponents.cq-theme-dialog
		 */
		runMethod() {
			var selector = this.node.attr("cq-selector");
			var method = this.node.attr("cq-method");

			var clickable = this;
			$(selector).each(function () {
				if (this[method])
					this[method].call(this, {
						context: clickable.context,
						caller: clickable,
					});
			});
		}
	}

	CIQ.UI.Clickable = Clickable;
	customElements.define("cq-clickable", Clickable);

	/**
	 * Close web component `<cq-close>`.
	 *
	 * cq-close web component will close its containing (parent or up) component
	 * by calling its close() method
	 * @namespace WebComponents.cq-close
	 * @example
	 * <cq-item>
	 * 		<cq-label></cq-label>
	 * 		<cq-close></cq-close>
	 * </cq-item>
	 *
	 */
	class Close extends CIQ.UI.BaseComponent {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			var self = this;
			function closure() {
				self.tap();
			}
			$(this).stxtap(closure);
			super.connectedCallback();
		}

		/**
		 * @alias tap
		 * @memberof WebComponents.cq-close
		 */
		tap() {
			CIQ.UI.containerExecute(this, "close");
		}
	}

	CIQ.UI.Close = Close;
	customElements.define("cq-close", Close);

	/**
	 * Symbol comparison component `<cq-comparison>`.
	 *
	 * Add attribute cq-marker in order to have the component insert itself as a marker on the chart
	 *
	 * @namespace WebComponents.cq-comparison
	 * @example
<cq-comparison cq-marker>
	<cq-menu class="cq-comparison-new">
		<cq-comparison-add-label>
			<cq-comparison-plus></cq-comparison-plus><span>Compare</span><span>...</span>
		</cq-comparison-add-label>
		<cq-comparison-add>
			<cq-comparison-lookup-frame>
				<cq-lookup cq-keystroke-claim>
					<cq-lookup-input cq-no-close>
						<input type="text" cq-focus spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Enter Symbol">
						<cq-lookup-icon></cq-lookup-icon>
					</cq-lookup-input>
					<cq-lookup-results>
						<cq-lookup-filters cq-no-close>
							<cq-filter class="true">ALL</cq-filter>
							<cq-filter>STOCKS</cq-filter>
							<cq-filter>FX</cq-filter>
							<cq-filter>INDEXES</cq-filter>
							<cq-filter>FUNDS</cq-filter>
							<cq-filter>FUTURES</cq-filter>
						</cq-lookup-filters>
						<cq-scroll></cq-scroll>
					</cq-lookup-results>
				</cq-lookup>
			</cq-comparison-lookup-frame>
			<cq-swatch cq-no-close></cq-swatch>
			<span><cq-accept-btn class="stx-btn">ADD</cq-accept-btn></span>
		</cq-comparison-add>
	</cq-menu>
	<cq-comparison-key>
		<template cq-comparison-item>
			<cq-comparison-item>
				<cq-comparison-swatch></cq-comparison-swatch>
				<cq-comparison-label>AAPL</cq-comparison-label>
				<!-- cq-comparison-price displays the current price with color animation -->
				<cq-comparison-price cq-animate></cq-comparison-price>
				<!-- cq-comparison-tick-price displays the price for the active crosshair item -->
				<!-- <cq-comparison-tick-price></cq-comparison-tick-price>	-->
				<cq-comparison-loader></cq-comparison-loader>
				<div class="stx-btn-ico ciq-close"></div>
			</cq-comparison-item>
		</template>
	</cq-comparison-key>
</cq-comparison>
	 */
	class Comparison extends CIQ.UI.ModalTag {
		constructor() {
			super();
			this.swatchColors = [];
			this.loading = [];
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			this.swatchColors = [
				"#8ec648",
				"#00afed",
				"#ee652e",
				"#912a8e",
				"#fff126",
				"#e9088c",
				"#ea1d2c",
				"#00a553",
				"#00a99c",
				"#0056a4",
				"#f4932f",
				"#0073ba",
				"#66308f",
				"#323390",
			];
		}

		/**
		 * Initializes all the children UI elements that make up `<cq-comparison>`.
		 * @alias configureUI
		 * @memberof WebComponents.cq-comparison
		 */
		configureUI() {
			var node = this.node;
			var addNew = node.find("cq-accept-btn");
			this.template = node.find("*[cq-comparison-item]");
			var swatchColors = node.find("cq-swatch").attr("cq-colors");
			if (swatchColors) this.swatchColors = swatchColors.split(",");
			for (var i = 0; i < this.swatchColors.length; i++) {
				this.swatchColors[i] = CIQ.convertToNativeColor(this.swatchColors[i]);
			}
			var lookup = node.find("cq-lookup");
			if (lookup.length)
				lookup[0].setCallback(
					(function (self) {
						return function () {
							self.selectItem.apply(self, arguments);
						};
					})(this)
				);
			addNew.stxtap(function (e) {
				lookup[0].forceInput();
				e.stopPropagation();
			});
			var input = node.find("input");
			input.stxtap(function () {
				this.focus();
			});
		}

		/**
		 * Picks a color to display the new comparison as.
		 * Loops through preset colors and picks the next one on the list.
		 * If the all colors are taken then the last color will be repeated.
		 * @alias pickSwatchColor
		 * @memberof WebComponents.cq-comparison
		 */
		pickSwatchColor() {
			var node = $(this);
			var stx = this.context.stx;
			var swatch = node.find("cq-swatch");
			if (!swatch.length) return;
			var currentColor = swatch[0].style.backgroundColor;

			var usedColors = {};
			for (var s in stx.chart.series) {
				var series = stx.chart.series[s];
				if (!series.parameters.isComparison) continue;
				usedColors[series.parameters.color] = true;
			}

			if (currentColor !== "" && !usedColors[currentColor]) return; // Currently picked color not in use then allow it
			for (var i = 0; i < this.swatchColors.length; i++) {
				// find first unused color from available colors
				if (!usedColors[this.swatchColors[i]]) {
					swatch[0].style.backgroundColor = this.swatchColors[i];
					return;
				}
			}
			//Uh oh, all colors take. Last color will keep getting used.
		}

		position() {
			var stx = this.context.stx;
			var bar = stx.barFromPixel(stx.cx);
			this.tick = stx.tickFromPixel(stx.cx);
			var prices = stx.chart.xaxis[bar];
			var self = this;

			function printValues() {
				var key;
				self.timeout = null;
				for (var s in stx.chart.series) {
					if (!key) key = self.node.find("cq-comparison-key");
					var price = key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-tick-price');
					price.textBetter("");
					if (price.length && prices && prices.data) {
						var symbol = stx.chart.series[s].parameters.symbol;
						price.textBetter(stx.padOutPrice(prices.data[symbol]));
						var pdSymbol = prices.data[symbol];
						if (pdSymbol !== null) {
							if (typeof pdSymbol === "object") pdSymbol = pdSymbol.Close;
							price.textBetter(stx.padOutPrice(pdSymbol));
						}
					}
				}
			}
			if (this.tick != this.prevTick) {
				if (this.timeout) clearTimeout(this.timeout);
				var ms = 0; // IE and FF struggle to keep up with the dynamic heads up.
				this.timeout = setTimeout(printValues, ms);
			}
			this.prevTick = this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
		}

		/**
		 * Handles removing a series from the comparison.
		 * @param {string} symbol Name of series as a string.
		 * @param {object}  series Object containing info on series.
		 * @alias removeSeries
		 * @memberof WebComponents.cq-comparison
		 */
		removeSeries(symbol, series) {
			this.context.stx.removeSeries(symbol);
		}

		/**
		 * The legend gets re-rendered whenever we createDataSet() (wherein the series may have changed).
		 * We re-render the entire thing each time, but we use a virtual DOM to determine whether
		 * to actually change anything on the screen (so as to avoid unnecessary flickering)
		 * @alias renderLegend
		 * @memberof WebComponents.cq-comparison
		 */
		renderLegend() {
			var node = $(this);
			var key = node.find("cq-comparison-key").cqvirtual();
			var stx = this.context.stx;
			var q = stx.currentQuote();
			for (var s in stx.chart.series) {
				var series = stx.chart.series[s];
				if (!series.parameters.isComparison) continue;
				var frag = CIQ.UI.makeFromTemplate(this.template);
				var swatch = frag.find("cq-comparison-swatch");
				var label = frag.find("cq-comparison-label");
				var description = frag.find("cq-comparison-description");
				var price = frag.find("cq-comparison-price");
				var loader = frag.find("cq-comparison-loader");
				var btn = frag.find(".ciq-close");
				swatch.css({ "background-color": series.parameters.color });
				label.text(stx.translateIf(series.display));
				description.text(stx.translateIf(series.description));
				frag.attr("cq-symbol", s);

				var symbol = series.parameters.symbol;
				if (price.length && q && symbol !== null) {
					var qSymbol = q[symbol];
					if (typeof qSymbol === "object") qSymbol = q[symbol].Close;
					price.text(stx.padOutPrice(qSymbol));
				}

				if (this.loading[series.parameters.symbolObject.symbol]) loader.addClass("stx-show");
				else loader.removeClass("stx-show");
				if (series.parameters.error) frag.attr("cq-error", true);
				if (series.parameters.permanent) btn.hide();
				else {
					btn.stxtap(
						(function (self, s, series) {
							return function () {
								self.nomore = true;
								if (!series.parameters.permanent) self.removeSeries(s, series);
								self.modalEnd(); // tricky, we miss mouseout events when we remove items from under ourselves
							};
						})(this, s, series)
					);
				}
				key.append(frag);
			}
			key.cqrender();
			this.pickSwatchColor();
		}

		/**
		 * Adds an injection to the ChartEngine that tracks the price of Comparisons.
		 * @param {number} updatePrices
		 * @alias startPriceTracker
		 * @memberof WebComponents.cq-comparison
		 */
		startPriceTracker(updatePrices) {
			var self = this;
			this.addInjection("append", "createDataSet", function () {
				if (updatePrices) self.updatePrices();
				if (this.chart.dataSet && this.chart.dataSet.length) self.node.attrBetter("cq-show");
				else self.node.removeAttrBetter("cq-show");
			});
		}

		startTickPriceTracker() {
			this.prevTick = null;
			this.addInjection(
				"prepend",
				"headsUpHR",
				(function (self) {
					return function () {
						self.position();
					};
				})(this)
			);
		}

		/**
		 * Fires whenever a new security is added as a comparison.
		 * Handles all the necessary events to update the chart with the new comparison.
		 * @param {object} context `CIQ.UI.Context` The context of the chart.
		 * @param {object} obj The object holding info on a security.
		 * @alias selectItem
		 * @memberof WebComponents.cq-comparison
		 */
		selectItem(context, obj) {
			var self = this;
			function cb(err, series) {
				if (err) {
					series.parameters.error = true;
				}
				self.loading[series.parameters.symbolObject.symbol] = false;
				self.renderLegend();
			}
			var swatch = this.node.find("cq-swatch");
			var color = "auto",
				pattern = null,
				width = 1;
			if (swatch[0]) {
				var style = swatch[0].style;
				color = style.backgroundColor;
				pattern = style.borderTopStyle;
				width = style.width || 1;
			}
			var stx = context.stx;
			this.loading[obj.symbol] = true;
			var params = {
				name: "_generic_series",
				symbolObject: obj,
				isComparison: true,
				color: color,
				pattern: pattern,
				width: width || 1,
				data: { useDefaultQuoteFeed: true },
				forceData: true,
			};

			// don't allow symbol if same as main chart, comparison already exists, or just white space
			var exists = stx.getSeries({ symbolObject: obj });
			for (var i = 0; i < exists.length; i++)
				if (exists[i].parameters.isComparison) {
					this.loading[obj.symbol] = false;
					return;
				}

			// don't allow symbol if same as main chart or just white space
			if (context.stx.chart.symbol.toLowerCase() !== obj.symbol.toLowerCase() && obj.symbol.trim().length > 0) {
				stx.addSeries(obj.symbol, params, cb);
			} else {
				this.loading[obj.symbol] = false;
			}
		}

		setContext(context) {
			var chart = this.context.stx.chart;
			this.node.attr("cq-show", "true");
			// if attribute cq-marker then detach and put ourselves in the chart holder
			this.configureUI();
			var self = this;
			CIQ.UI.observe({
				obj: chart.series,
				action: "callback",
				value: function () {
					self.renderLegend();
				},
			});
			this.context.stx.append("modifySeries", function () {
				self.renderLegend();
			});
			var frag = CIQ.UI.makeFromTemplate(this.template);
			this.startPriceTracker(frag.find("cq-comparison-price").length);
			if (frag.find("cq-comparison-tick-price")) {
				this.startTickPriceTracker();
			}
		}

		/**
		 * Loops thru `stxx.chart.series` to update the current price of all comparisons.
		 * @alias updatePrices
		 * @memberof WebComponents.cq-comparison
		 */
		updatePrices() {
			var key; // lazy eval this to prevent jquery work when no comparisons exist
			var stx = this.context.stx;
			var historical = stx.isHistoricalModeSet;
			var q = stx.currentQuote();
			if (q) {
				for (var s in stx.chart.series) {
					if (!key) key = this.node.find("cq-comparison-key");
					var price = key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-price');
					if (price.length) {
						var oldPrice = parseFloat(price.text());
						var symbol = stx.chart.series[s].parameters.symbol;
						var newPrice = q[symbol];
						var field = stx.chart.series[s].parameters.field || "Close";
						if (newPrice && (newPrice[field] || newPrice[field] === 0)) newPrice = newPrice[field];
						if (!newPrice && newPrice !== 0 && stx.chart.series[s].lastQuote)
							newPrice = stx.chart.series[s].lastQuote[field];
						price.text(stx.padOutPrice(historical ? "" : newPrice));
						if (historical) return;
						if (typeof price.attr("cq-animate") != "undefined") CIQ.UI.animatePrice(price, newPrice, oldPrice);
					}
				}
			}
		}
	}

	CIQ.UI.Comparison = Comparison;
	customElements.define("cq-comparison", Comparison);

	/**
	 * Simple WebComponent that allows data binding to arbitrary properties of currentVectorParameters.
	 * Ideal for use as a drawing toolbar extension.
	 *
	 * @example
	 * <cq-cvp-controller cq-section cq-cvp-header="1">
	 * 	<div cq-section>
	 * 		<div class="ciq-heading">Dev 1</div>
	 * 		<span stxtap="toggleActive()" class="ciq-checkbox">
	 * 			<span></span>
	 * 		</span>
	 * 	</div>
	 * 	<cq-line-color cq-section class="ciq-color" stxbind="getColor()" stxtap="pickColor()">
	 * 		<span></span>
	 * 	</cq-line-color>
	 * 	<cq-line-style cq-section>
	 * 		<cq-menu class="ciq-select">
	 * 			<span cq-cvp-line-style class="ciq-line ciq-selected"></span>
	 * 			<cq-menu-dropdown class="ciq-line-style-menu">
	 * 				<cq-item stxtap="setStyle(1, 'solid')"><span class="ciq-line-style-option ciq-solid-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'solid')"><span class="ciq-line-style-option ciq-solid-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'solid')"><span class="ciq-line-style-option ciq-solid-5"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(1, 'dotted')"><span class="ciq-line-style-option ciq-dotted-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'dotted')"><span class="ciq-line-style-option ciq-dotted-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'dotted')"><span class="ciq-line-style-option ciq-dotted-5"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(1, 'dashed')"><span class="ciq-line-style-option ciq-dashed-1"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(3, 'dashed')"><span class="ciq-line-style-option ciq-dashed-3"></span></cq-item>
	 * 				<cq-item stxtap="setStyle(5, 'dashed')"><span class="ciq-line-style-option ciq-dashed-5"></span></cq-item>
	 * 			</cq-menu-dropdown>
	 * 		</cq-menu>
	 * 	</cq-line-style>
	 * </cq-cvp-controller>
	 */
	class CVPController extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		get active() {
			return this.context.stx.currentVectorParameters["active" + this._scope];
		}

		set active(value) {
			this.context.stx.currentVectorParameters["active" + this._scope] = value;
		}

		get color() {
			return this.context.stx.currentVectorParameters["color" + this._scope];
		}

		set color(value) {
			this.context.stx.currentVectorParameters["color" + this._scope] = value;
		}

		get lineWidth() {
			return this.context.stx.currentVectorParameters["lineWidth" + this._scope];
		}

		set lineWidth(value) {
			this.context.stx.currentVectorParameters["lineWidth" + this._scope] = value;
		}

		get pattern() {
			return this.context.stx.currentVectorParameters["pattern" + this._scope];
		}

		set pattern(value) {
			this.context.stx.currentVectorParameters["pattern" + this._scope] = value;
		}

		connectedCallback() {
			if (this.attached) return;

			Object.defineProperty(this, "_scope", {
				configurable: true,
				enumerable: false,
				value: this.getAttribute("cq-cvp-header") || "",
				writable: false,
			});

			var tmpl = $('template[cq-cvp-controller], template[cvp-controller="true"]');

			if (this.children.length === 0 && tmpl.length) {
				var nodes = CIQ.UI.makeFromTemplate(tmpl, this);
				var heading = this.querySelector(".ciq-heading");
				if (heading) {
					heading.innerHTML = this._scope;
				}
			}

			super.connectedCallback();
		}

		emit(eventName, value) {
			if (this.toolbar) {
				this.toolbar.emit(eventName, value);
			} else if (typeof CustomEvent === "function") {
				this.dispatchEvent(
					new CustomEvent(eventName, {
						bubbles: true,
						cancelable: true,
						detail: value,
					})
				);
			} else {
				// IE11 typeof above returned 'object' instead of 'function'
				var event = document.createEvent("CustomEvent");
				event.initCustomEvent(eventName, true, true, value);
				this.dispatchEvent(event);
			}
		}

		getColor(activator) {
			var node = $(activator.node || $(this).find("cq-line-color"));
			var color = this.color;

			if (color == "transparent" || color == "auto") {
				color = "";
			}

			$(node).css({
				background: color,
			});

			var bgColor = CIQ.getBackgroundColor(this.parentNode);
			if (!color || Math.abs(CIQ.hsl(bgColor)[2] - CIQ.hsl(color)[2]) < 0.2) {
				var border = CIQ.chooseForegroundColor(bgColor);
				node.css({ border: "solid " + border + " 1px" });
				if (!color)
					node.css({
						background:
							"linear-gradient(to bottom right, " +
							border +
							"," +
							border +
							" 49%, " +
							bgColor +
							" 50%, " +
							bgColor +
							")",
					});
			} else {
				node.css({ border: "" });
			}
		}

		pickColor(activator) {
			var colorPicker = $("cq-color-picker")[0];
			var cvpController = this;
			var overrides = $(activator.node).attr("cq-overrides");

			if (!colorPicker) return console.error("CVPController.prototype.pickColor: no <cq-color-picker> available");
			if (overrides) activator.overrides = overrides.split(",");

			colorPicker.callback = function (color) {
				cvpController.color = color;
				cvpController.getColor(activator);
				cvpController.emit("change", {
					color: color,
				});
			};
			colorPicker.display(activator);
		}

		setContext() {
			this.setStyle();
		}

		setStyle(activator, width, pattern) {
			width = width || "1";
			pattern = pattern || "dotted";

			this.lineWidth = parseInt(width, 10);
			this.pattern = pattern;

			var selection = $(this).find("*[cq-cvp-line-style]");

			if (this.lineStyleClassName) {
				selection.removeClass(this.lineStyleClassName);
			}

			if (pattern && pattern !== "none") {
				this.lineStyleClassName = "ciq-" + pattern + "-" + this.lineWidth;
				selection.addClass(this.lineStyleClassName);
			} else {
				this.lineStyleClassName = null;
			}

			this.emit("change", {
				lineWidth: width,
				pattern: pattern,
			});
		}

		/**
		 * Update the component state with configuration. May be a drawing instance or
		 * currentVectorParameters.
		 *
		 * @param {Object} config drawing instance or currentVectorParameters
		 */
		sync(config) {
			var active = config["active" + this._scope];
			var color = config["color" + this._scope];
			var lineWidth = config["lineWidth" + this._scope];
			var pattern = config["pattern" + this._scope];

			var className = "ciq-active";
			var checkbox = $(this).find(".ciq-checkbox");

			if (active) {
				checkbox.addClass(className);
			} else {
				checkbox.removeClass(className);
			}

			this.active = !!active;
			this.color = color || "";
			this.getColor({});
			this.setStyle(null, lineWidth, pattern);
		}

		toggleActive(activator) {
			var node = $(activator.node);
			var className = "ciq-active";

			if (this.active) {
				this.active = false;
				node.removeClass(className);
			} else {
				this.active = true;
				node.addClass(className);
			}

			this.emit("change", {
				active: this.active,
			});
		}
	}

	CIQ.UI.CVPController = CVPController;
	customElements.define("cq-cvp-controller", CVPController);

	/**
	 * Dialog web component `<cq-dialog>`.
	 *
	 * Manages general dialog interaction such as display, hide, location, size, tap interaction, etc
	 *
	 * @namespace WebComponents.cq-dialog
	 * @example
<cq-dialog cq-timezone-dialog>
	<cq-timezone-dialog>
		<h4 class="title">Choose Timezone</h4>
		<cq-close></cq-close>

		<p>To set your timezone use the location button below, or scroll through the following list...</p>
		<p class="currentUserTimeZone"></p>
    <div class="detect">
    <div class="ciq-btn" stxtap="Layout.removeTimezone()">Use My Current Location</div>
    </div>
    <div class="timezoneDialogWrapper" style="max-height:360px; overflow: auto;">
	        <ul>
	          <li class="timezoneTemplate" style="display:none;cursor:pointer;"></li>
	        </ul>
        </div>
    <div class="instruct">(Scroll for more options)</div>
	</cq-timezone-dialog>
</cq-dialog>
	 */
	class Dialog extends CIQ.UI.BaseComponent {
		constructor() {
			super();
			this.activeAttributes = {};
		}

		/**
		 * The attributes that are added to a cq-dialog when it is opened (and removed when closed).
		 * Contains "cq-active" by default.
		 * @memberof WebComponents.cq-dialog
		 * @type {Object}
		 */
		connectedCallback() {
			if (this.attached) return;
			this.isDialog = true;
			super.connectedCallback();
			var self = this;
			function handleTap(e) {
				self.tap(e);
			}
			this.node.stxtap(handleTap);

			var uiManager = $("cq-ui-manager");
			uiManager.each(function () {
				this.registerForResize(self);
				self.uiManager = this;
			});
		}

		disconnectedCallback() {
			var self = this;
			var uiManager = $("cq-ui-manager");
			uiManager.each(function () {
				this.unregisterForResize(self);
			});
			super.disconnectedCallback();
		}

		/**
		 * Creates a new attribute to be activated when the dialog is open. Use
		 * this to style the dialog. This is automatically set by any component
		 * that is derived from DialogContentTag
		 * @param {string} attribute The attribute to add or remove
		 * @memberof WebComponents.cq-dialog
		 * @since  4.1.0
		 * @example
		 * <style> cq-dialog[cq-study-context]{ padding:0; } </style>
		 * <cq-dialog cq-study-context></cq-dialog>
		 */
		addActiveAttribute(attribute) {
			this.activeAttributes[attribute] = true;
		}

		center() {
			var parent = this.node.parent();
			if (parent[0].tagName == "BODY") parent = $(window);
			var w = parent.guaranteedWidth();
			var h = parent.guaranteedHeight();
			var cw = this.node.outerWidth();
			var ch = this.node.outerHeight();
			var left = w / 2 - cw / 2;
			var top = h / 2 - ch / 2;
			if (left < 0) left = 0;
			if (h > ch * 2 && top + ch / 2 > h / 3) {
				top = h / 3 - ch / 2; // Position 1/3 down the screen on large screens
			}
			if (top < 0) top = 0;
			this.node.css({ top: top + "px", left: left + "px" });
		}

		close() {
			this.uiManager.closeMenu(this);
		}

		hide() {
			if ($(this).find(":invalid").length) return;
			// Call the "hide()" function for any immediate children. This will allow nested
			// components to clean themselves up when a dialog is removed from outside of their scope.
			this.node.children().each(function () {
				if (typeof this.hide == "function") this.hide();
			});
			this.active = false;
			if (this.uiManager.overlay) this.uiManager.overlay.removeAttrBetter("cq-active");
			//this.uiManager.overlay=null;
			for (var attribute in this.activeAttributes) {
				this.node.removeAttrBetter(attribute);
			}
			this.activeAttributes = {};

			// blur any input boxes that are inside the dialog we're closing, to get rid of soft keyboard
			$(this)
				.find("input")
				.each(function () {
					if (this == document.activeElement) this.blur();
				});
		}

		open(params) {
			this.uiManager.openMenu(this, params);
		}

		resize() {
			if (this.params && this.params.x) {
				this.stxContextMenu();
			} else {
				this.center();
			}
			var scrollers = $(this.node).find("cq-scroll");
			scrollers.each(function () {
				this.resize();
			});
		}

		/**
		 * Show the dialog. Use X,Y *screen location* (pageX, pageY from an event) for where to display context menus. If the context menu cannot fit on the screen then it will be adjusted leftward and upward
		 * by enough pixels so that it shows.
		 * @param {object} [params] Parameters
		 * @param  {Boolean} [params.bypassOverlay=false] If true will not display the scrim overlay
		 * @param {Number} [params.x] X location of top left corner. Use for context menus, otherwise dialog will be centered.
		 * @param {Number} [params.y] Y location of top left corner. Use for context menus, otherwise dialog will be centered.
		 * @alias show
		 * @memberof WebComponents.cq-dialog
		 */
		show(params) {
			this.params = params;
			if (!params) params = this.params = {};
			var self = this;
			if (!this.uiManager.overlay && !params.bypassOverlay) {
				this.uiManager.overlay = $("<cq-dialog-overlay></cq-dialog-overlay>");
				var context = params.context || CIQ.UI.getMyContext(this);
				if (context) context.node.append(this.uiManager.overlay);
			}
			setTimeout(function () {
				// to get the opacity transition effect
				if (self.uiManager.overlay && !params.bypassOverlay) self.uiManager.overlay.attrBetter("cq-active");
				self.activeAttributes["cq-active"] = true; // cq-active is what css uses to display the dialog
				for (var attribute in self.activeAttributes) {
					self.node.attrBetter(attribute);
				}
				self.resize();
				self.active = true;
			});
		}

		stxContextMenu() {
			var parent = this.node.parent();
			if (parent[0].tagName == "BODY") parent = $(window);
			var w = parent.guaranteedWidth();
			var h = parent.guaranteedHeight();
			var cw = this.node.outerWidth();
			var ch = this.node.outerHeight();
			var left = this.params.x;
			var top = this.params.y;
			var saveAdjustedPosition = false;

			this.node.find("cq-menu.stxMenuActive:has(.context-menu-right)").each(function () {
				var menu = $(this);
				var contextMenuRight = menu.find(".context-menu-right");
				var overlapItemCount = menu.nextAll().length + 1;

				cw += contextMenuRight.outerWidth();
				ch += contextMenuRight.outerHeight() - menu.outerHeight() * overlapItemCount;
				saveAdjustedPosition = true;
			});

			if (left + cw > w) left = w - cw;
			if (top + ch > h) top = h - ch;
			if (top < 0) top = 0;
			if (saveAdjustedPosition) {
				this.params.x = left;
				this.params.y = top;
			}

			this.node.css({ top: top + "px", left: left + "px" });
		}

		tap(e) {
			var topMenu = this.uiManager.topMenu();
			if (topMenu === this) {
				e.stopPropagation(); // prevent a tap inside the dialog from closing itself
				return;
			}
			if (!e.currentTarget.active) {
				e.stopPropagation(); // If the dialog we tapped on is closed, then we must have closed it manually. Don't allow a body tap otherwise we'll close two dialogs!
			}
		}
	}

	CIQ.UI.Dialog = Dialog;
	customElements.define("cq-dialog", Dialog);

	/**
	 * Drawing Context Dialog web component `<cq-drawing-context>`.
	 * Managed by an instance of {CIQ.UI.DrawingEdit}.
	 *
	 * @namespace WebComponents.cq-drawing-context
	 * @since 6.2.0
	 */
	class DrawingContext extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * Open the context menu as a dialog.
		 *
		 * @param {Object} params
		 * @param {number} params.x used to position the dialog
		 * @param {number} params.y used to position the dialog
		 * @param {CIQ.Drawing} params.drawing sets the `drawing` instance property
		 * @param {CIQ.UI.Context} params.context passed to the components setContext method
		 * @since 6.2.0
		 */
		open(params) {
			this.drawing = params.drawing;
			var textEdit = $(this).find("[cq-edit-text]");
			if (this.drawing.edit) {
				textEdit.show();
			} else {
				textEdit.hide();
			}
			return super.open(params);
		}
	}

	CIQ.UI.DrawingContext = DrawingContext;
	customElements.define("cq-drawing-context", DrawingContext);

	/**
	 * fibonacci settings dialog web component `<cq-fib-settings-dialog>`.
	 *
	 * @namespace WebComponents.cq-fib-settings-dialog
	 * @example
	  <cq-dialog>
	  	<cq-fib-settings-dialog>
	  		<h4 class="title">Settings</h4>
	  		<cq-scroll cq-no-maximize>
	  			<cq-fibonacci-settings>
	  				<template cq-fibonacci-setting>
	  					<cq-fibonacci-setting>
	  						<div class="ciq-heading"></div>
	  						<div class="stx-data"></div>
	  					</cq-fibonacci-setting>
	  				</template>
	  			</cq-fibonacci-settings>
	  		</cq-scroll>
	  		<div class="ciq-dialog-cntrls">
	  			<div class="ciq-btn" stxtap="close()">Done</div>
	  		</div>
	  	</cq-fib-settings-dialog>
	  </cq-dialog>
	 * @since 3.0.9
	 */
	class FibSettingsDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * Adds a custom fib level
		 * @memberOf WebComponents.cq-fib-settings-dialog
		 * @since 5.2.0
		 */
		add() {
			var level = $(this).find("[cq-custom-fibonacci-setting] input").val();
			if (!level) return;
			level = parseFloat(level) / 100;
			if (isNaN(level)) return;
			var defaultFibs = this.context.stx.currentVectorParameters.fibonacci.fibs || [];
			var fib, newFib;
			for (var index = 0; index < defaultFibs.length; index++) {
				fib = defaultFibs[index];
				if (fib.level > level) {
					newFib = CIQ.clone(fib);
					newFib.level = level;
					newFib.display = true;
					defaultFibs.splice(index, 0, newFib);
					break;
				}
			}
			if (!newFib) {
				if (defaultFibs.length) fib = CIQ.clone(defaultFibs[0]);
				else
					fib = {
						color: "auto",
						parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
					};
				newFib = CIQ.clone(fib);
				newFib.level = level;
				newFib.display = true;
				defaultFibs.push(newFib);
			}
			this.open();
		}

		/**
		 * Fires a "change" event and closes the dialog.
		 *
		 * @memberOf WebComponents.cq-fib-settings-dialog
		 * @since 6.2.0
		 */
		close() {
			var event;

			if (typeof Event === "function") {
				event = new Event("change", {
					bubbles: true,
					cancelable: true,
				});
			} else {
				event = document.createEvent("Event");
				event.initEvent("change", true, true);
			}

			if (this.opener) this.opener.dispatchEvent(event);
			super.close();
		}

		/**
		 * Opens the cq-fib-settings-dialog
		 * @param  {Object} params Parameters
		 * @memberOf WebComponents.cq-fib-settings-dialog
		 */
		open(params) {
			super.open(params);
			if (params) this.opener = params.caller;
			var vectorParameters = this.context.stx.currentVectorParameters;
			var vectorType = vectorParameters.vectorType;
			var dialog = $(this);

			// fibonacci type
			var parameters;
			if (vectorParameters.fibonacci && vectorType != "fibtimezone") {
				dialog.find(".title").text("Fibonacci Settings");
				var defaultFibs = vectorParameters.fibonacci.fibs || [];
				parameters = dialog.find("cq-fibonacci-settings");
				parameters.emptyExceptTemplate();

				for (var index = 0; index < defaultFibs.length; index++) {
					var fib = defaultFibs[index];

					// no negative values for fibonacci arc
					if (vectorType === "fibarc" && fib.level < 0) continue;

					var newParam = CIQ.UI.makeFromTemplate(this.node.find("template"), parameters);
					var convertPercent = fib.level * 100;
					newParam.find(".ciq-heading").text(convertPercent.toFixed(1) + "%");
					var paramInput = newParam.find("input");

					if (fib.display) {
						paramInput.prop("checked", true);
					}

					this.setChangeEvent(paramInput, "fib", fib.level);
					newParam.find(".stx-data").append(paramInput);
				}
			}
			// settings dialog default
			else {
				dialog.find(".title").text("Settings");

				// clear the existing web components
				parameters = dialog.find("cq-fibonacci-settings");
				parameters.emptyExceptTemplate();
			}
			$(this).find("[cq-custom-fibonacci-setting] input").val("");
		}

		/**
		 * Sets up a handler to process changes to fields
		 * @param {HTMLElement} node    The input field
		 * @param {string} section The section that is being updated
		 * @param {string} name    The name of the field being updated
		 * @memberOf WebComponents.cq-fib-settings-dialog
		 * @private
		 */
		setChangeEvent(node, section, item) {
			var self = this;
			function closure() {
				return function () {
					var vectorParameters = self.context.stx.currentVectorParameters;
					var vectorType = vectorParameters.vectorType;

					// fibonacci type
					if (vectorParameters.fibonacci && vectorType != "fibtimezone") {
						var defaultFibs = vectorParameters.fibonacci.fibs || [];
						if (this.type == "checkbox") {
							for (var index = 0; index < defaultFibs.length; index++) {
								var fib = defaultFibs[index];

								if (fib.level === item) {
									fib.display = this.checked ? true : false;
								}
							}
						}
					}
				};
			}
			node.change(closure());
		}
	}

	CIQ.UI.FibSettingsDialog = FibSettingsDialog;
	customElements.define("cq-fib-settings-dialog", FibSettingsDialog);

	/**
	 * Language Dialog web component `<cq-language-dialog>`. This creates a dialog that the user can use to change the language.
	 *
	 * The actual language choices are obtained from {@link CIQ.I18N.languages}. Choosing a different language causes the entire
	 * UI to be translated through use of the {@link CIQ.I18N.setLanguage} method.
	 *
	 * @namespace WebComponents.cq-language-dialog
	 * @since
	 * <br>&bull; 4.0.0 New component added added.
	 * <br>&bull; 4.1.0 now it calls {@link CIQ.I18N.localize} instead of {@link CIQ.I18N.setLocale}
	 * @example
	 <cq-dialog>
	 	<cq-language-dialog>
	 	</cq-language-dialog>
	 </cq-dialog>
	 */
	class LanguageDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * Closes dialog box
		 * @alias close
		 * @memberof WebComponents.cq-share-dialog
		 * @since 4.0.0
		 */
		close() {
			$("cq-language-dialog")
				.closest("cq-dialog,cq-menu")
				.each(function () {
					this.close();
				});
		}

		/**
		 * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
		 * @alias open
		 * @memberof WebComponents.cq-share-dialog
		 * @since 4.0.0
		 */
		open(params) {
			super.open(params);
			var cqLanguages = this.node.find("cq-languages");
			cqLanguages.emptyExceptTemplate();
			var template = this.node.find("template");
			var languages = CIQ.I18N.languages;
			if (!languages) return;
			function switchToLanguage(langCode) {
				return function () {
					CIQ.UI.contextsForEach(function () {
						var stx = this.stx;
						stx.preferences.language = langCode;
						stx.changeOccurred("preferences");
						CIQ.I18N.localize(stx, langCode);
						stx.draw();
					});
				};
			}
			for (var langCode in languages) {
				var node = CIQ.UI.makeFromTemplate(template, cqLanguages);
				node.find("cq-language-name").text(languages[langCode]);
				node.find("cq-flag").attr("cq-lang", langCode);
				node.stxtap(switchToLanguage(langCode));
			}
		}
	}

	CIQ.UI.LanguageDialog = LanguageDialog;
	customElements.define("cq-language-dialog", LanguageDialog);

	/**
	 * Loader web component `<cq-loader>`.
	 *
	 * CSS loading icon.
	 * @namespace WebComponents.cq-loader
	 * @example
	 <cq-loader><cq-loader>
	 */
	class Loader extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		setContext(context) {
			this.context.setLoader(this);
		}
		/**
		 * Shows the loading icon.
		 * @alias show
		 * @memberof WebComponents.cq-loader
		 */
		show() {
			$(this).addClass("stx-show");
		}

		/**
		 * Hides the loading icon.
		 * @alias hide
		 * @memberof WebComponents.cq-loader
		 */
		hide() {
			$(this).removeClass("stx-show");
		}
	}

	CIQ.UI.Loader = Loader;
	customElements.define("cq-loader", Loader);

	/**
	 * Lookup component `<cq-lookup>`.
	 *
	 * Note, a {@link CIQ.ChartEngine.Driver.Lookup} must be provided.
	 * If none is provided then the default will be used which displays no results.
	 *
	 * Use [CIQ.UI.Context.setLookupDriver](CIQ.UI.Context.html#setLookupDriver) to link the dirver to the [cq-lookup web component]{@link WebComponents.cq-lookup}
	 *
	 * Set <cq-lookup cq-uppercase> to force free form text to be converted to uppercase
	 *
	 * To turn off the result window modify CSS  to `.stxMenuActive cq-lookup cq-menu { opacity: 0 }`
	 *
	 * See `function startUI()` in sample-template-advanced.html for complete sample implementation.
	 *
	 * @namespace WebComponents.cq-lookup
	 * @example
<cq-lookup cq-keystroke-claim cq-keystroke-default>
	<cq-lookup-input cq-no-close>
		<input type="text" spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" name="symbol" placeholder="Enter Symbol">
		<cq-lookup-icon></cq-lookup-icon>
	</cq-lookup-input>
	<cq-lookup-results>
		<cq-lookup-filters cq-no-close>
			<cq-filter class="true">ALL</cq-filter>
			<cq-filter>STOCKS</cq-filter>
			<cq-filter>FX</cq-filter>
			<cq-filter>INDEXES</cq-filter>
			<cq-filter>FUNDS</cq-filter>
			<cq-filter>FUTURES</cq-filter>
		</cq-lookup-filters>
		<cq-scroll></cq-scroll>
	</cq-lookup-results>
</cq-lookup>
	 *
	 * @since  4.0.0 Added optional cq-uppercase attribute
	 */
	class Lookup extends CIQ.UI.ContextTag {
		constructor() {
			super();
			this.usingEmptyDriver = false;
			this.currentFilter = null;
			this.params = {};
		}

		acceptText(value, filter) {
			var self = this;
			if (!this.params.driver) {
				if (this.context.lookupDriver) {
					this.setDriver(this.context.lookupDriver);
				} else {
					this.setDriver(new CIQ.ChartEngine.Driver.Lookup());
					this.usingEmptyDriver = true;
				}
			}
			function closure(results) {
				self.results(results);
			}
			/**
			 * With the decoupling of the uiHelper to the Lookup.Driver you must be sure to include both an argument for maxResults and the closure to handle the results.
			 * maxResults must either be a number or a string to result in default value of 100.
			 * @alias acceptText
			 * @memberof WebComponents.cq-lookup
			 * @since 3.0.0
			 */
			this.params.driver.acceptText(value, filter, null, closure);
		}

		attachDriver(driver) {
			this.driver = driver;
		}

		close() {
			this.node.closest("cq-dialog,cq-menu").each(function () {
				this.close();
			});
		}

		forceInput() {
			var input = this.input[0];
			this.selectItem({ symbol: input.value });
			CIQ.blur(this.input);
			this.close();
			input.value = "";
		}

		initialize() {
			var node = $(this);
			this.resultList = node.find("cq-scroll");

			this.input = node.find("input");
			if (!this.input.length) {
				this.input = node.append($("<input type='hidden'>"));
				this.input[0].value = "";
			}
			var self = this;
			this.input.on("paste", function (e) {
				var input = e.target;
				setTimeout(function () {
					self.acceptText(input.value, self.currentFilter);
				}, 0);
			});
			var filters = node.find("cq-lookup-filters");
			if (filters) {
				filters.find("cq-filter").stxtap(function () {
					filters.find("cq-filter").removeClass("true");
					var t = $(this);
					t.addClass("true");
					var translate = t.find("translate");
					if (translate.length) {
						// if the filter text has been translated then it will be in a <translate> tag
						self.currentFilter = translate.attr("original");
					} else {
						self.currentFilter = this.innerHTML;
					}
					self.acceptText(self.input[0].value, self.currentFilter);
				});
			}

			if (typeof node.attr("cq-keystroke-claim") != "undefined") {
				// add keyboard claim for entire body
				this.addClaim(this);
			}
		}

		isActive() {
			return this.input[0].value !== "";
		}

		// Note that this captures keystrokes on the body. If the input box is focused then we need to allow the input box itself
		// to handle the strokes but we still want to capture them in order to display the lookup results. We first check
		// activeElement to see if the input is focused. If so then we bypass logic that manipulates the input.value. In order make
		// sure that the lookup menu is responding to an up-to-date input.value therefore we have to put all of those pieces of code
		// in setTimeout(0)
		//
		// Note that when comparisons are enabled, there are two Lookup components on the screen. Each keypress will therefore pass
		// through this function twice, once for each Lookup component. Only the active component will process the keystroke.
		keyStroke(hub, key, e, keystroke) {
			if (keystroke.ctrl || key == "Meta" || key == "Win") return false;
			var domChain = $(this).parents().addBack();
			var input = this.input[0];
			var result = false;
			var focused = document.activeElement === input; // If focused then we need to allow the input box to get most keystrokes
			if (
				!focused &&
				document.activeElement &&
				(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA")
			)
				return false; // some other input has focus

			var iAmActive = false,
				iAmDisplayed = false;
			if (domChain.hasClass("stxMenuActive")) {
				iAmDisplayed = true; // if my menu chain is active then I'm alive
			}
			if (focused || iAmDisplayed) iAmActive = true; // If my input is focused or I'm displayed, then I'm alive
			if (!iAmActive) {
				// Otherwise, I may still be alive under certain conditions
				if (typeof this.node.attr("cq-keystroke-default") == "undefined") return; // I'm always alive if I have default body keystrokes
				if (!iAmDisplayed && this.uiManager.topMenu()) return; // unless there's another menu active and it isn't me
			}
			if ((key === " " || key === "Spacebar") && input.value === "") {
				return false;
			}
			var self = this;
			if (keystroke.key && keystroke.key.length == 1 && e.which >= 32 && e.which <= 222) {
				if (!focused) input.value = input.value + keystroke.key; // Changes the <input> value when keystrokes are registered against the body.
				self.acceptText(input.value, self.currentFilter);
				result = true;
			}
			if (key == "Delete" || key == "Backspace" || key == "Del") {
				if (this.context.stx.anyHighlighted) return false;
				if (input.value.length) {
					//ctrl-a or highlight all text + delete implies remove all text
					if (window.getSelection().toString()) {
						input.value = "";
					} else {
						if (!focused) input.value = input.value.substring(0, input.value.length - 1);
						if (input.value.length) {
							self.acceptText(input.value, self.currentFilter);
						}
					}

					result = true; // only capture delete key if there was something to delete
				}
				if (key == "Backspace") result = true; // always capture backspace because otherwise chrome will navigate back
			}
			if ((key === "Escape" || key === "Esc") && iAmDisplayed) {
				input.value = "";
				this.close();
				CIQ.blur(input);
				result = true;
			}
			if (key === "Enter" && input.value !== "") {
				if (this.isActive()) {
					var scrollable = this.node.find("cq-scroll");
					focused = scrollable.length && scrollable[0].focused(); // Using cursor keys to maneuver down lookup results
					if (focused && focused.selectFC) {
						focused.selectFC.apply(focused, {});
					} else {
						var val = input.value;
						var toUpperCase = this.node.truthyAttr("cq-uppercase");
						if (toUpperCase) val = val.toUpperCase();
						this.selectItem({ symbol: val });
					}
					CIQ.blur(this.input);
					this.close();
					input.value = "";
					result = true;
				}
			}
			if (result) {
				// If we're focused, then keep the lookup open unless we hit escape.
				// Otherwise, if there is no length close it (user hit "escape", "enter", or "backspace/delete" while unfocused)
				if (
					this.usingEmptyDriver ||
					(!input.value.length && (key == "Escape" || key == "Esc" || key == "Enter" || !focused))
				) {
					this.close();
				} else {
					this.open();
				}
				if (focused) return { allowDefault: true };
				return true;
			}
		}

		open() {
			this.node.closest("cq-dialog,cq-menu").each(function () {
				this.open();
			});
		}

		/**
		 * Processes an array of results returned by the {@link CIQ.ChartEngine.Driver.Lookup} and displays them.
		 *
		 * Each element in the array will be of the following format:
		 * {
		 * 		display:["symbol-id","Symbol Description","exchange"],
		 * 		data:{
		 * 			symbol:"symbol-id",
		 * 			name:"Symbol Description",
		 * 			exchDis:"exchange"
		 * 		}
		 * }
		 *
		 * The lookup widget by default displays three columns as represented by the array.
		 * The data object can be an format required by your QuoteFeed or it can be a simple
		 * string if you just need to support a stock symbol.
		 * @param  {Array} arr The array of results.
		 * @alias results
		 * @memberof WebComponents.cq-lookup
		 */
		results(arr) {
			function closure(self, data) {
				return function (e) {
					CIQ.blur(self.input);
					//self.close();
					self.selectItem(data);
					self.input[0].value = "";
				};
			}

			this.resultList.empty();
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				var nodeText = "<cq-item>";
				for (var j = 0; j < item.display.length; j++) {
					nodeText += "<SPAN>" + item.display[j] + "</SPAN>";
				}
				nodeText += "</cq-item>";
				var node = $(nodeText);
				this.resultList.append(node);
				node[0].selectFC = closure(this, item.data);
				node.stxtap(node[0].selectFC);
			}
			var scrollable = this.node.find("cq-scroll");
			if (scrollable.length) scrollable[0].top();
		}

		/**
		 * Accepts a new symbol or symbolObject
		 * @param  {Object} data The symbol object (in a form accepted by {@link CIQ.ChartEngine#loadChart})
		 * @param  {Object} params Settings to control callback action
		 * @alias selectItem
		 * @memberof WebComponents.cq-lookup
		 */
		selectItem(data, params) {
			if (this.params.cb) {
				this.params.cb(this.context, data, params);
			}
		}

		/**
		 * Set a callback method for when the user selects a symbol
		 * @param {Function} cb Callback method
		 * @alias setCallback
		 * @memberof WebComponents.cq-lookup
		 */
		setCallback(cb) {
			this.params.cb = cb;
		}

		setContext(context) {
			this.initialize();
		}

		/**
		 * Set a {@link CIQ.ChartEngine.Driver.Lookup}. If none is set then CIQ.UI.Context.lookupDriver will be used.
		 * If none available then the input box will still be active but not present a drop down.
		 * @param {CIQ.ChartEngine.Driver.Lookup} driver The driver
		 * @alias setDriver
		 * @memberof WebComponents.cq-lookup
		 */
		setDriver(driver) {
			this.params.driver = driver;
		}
	}

	CIQ.UI.SymbolLookup = Lookup;
	customElements.define("cq-lookup", Lookup);

	/**
	 * Menu web component `<cq-menu>`.
	 *
	 * Node that is contextually aware of its surroundings. Handles opening and closing {@link WebComponents.cq-menu-dropdown}.
	 * @namespace WebComponents.cq-menu
	 * @example
	 <cq-menu class="ciq-menu stx-markers collapse">
	 	<span>Events</span>
	 	<cq-menu-dropdown>
	 		<cq-item class="square">Simple Square <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="circle">Simple Circle <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="callouts">Callouts <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="abstract">Abstract <span class="ciq-radio"><span></span></span>
	 		</cq-item>
	 		<cq-item class="none">None <span class="ciq-radio ciq-active"><span></span></span>
	 		</cq-item>
	 	</cq-menu-dropdown>
	 </cq-menu>
	 */
	class Menu extends HTMLElement {
		constructor() {
			super();
			this.node = $(this);
			this.activeClassName = "stxMenuActive";
			this.active = false;
		}

		connectedCallback() {
			if (this.attached) return;
			this.uiManager = $("cq-ui-manager");
			if (this.uiManager.length > 0) this.uiManager = this.uiManager[0];

			this.attached = true;

			if (this.node.attr("readonly")) return;
			var self = this;
			function handleTap(e) {
				self.tap(e);
			}
			function handleCaptureTap(e) {
				self.captureTap(e);
			}
			var thisNode = this.node[0];
			this.node.stxtap(handleTap);
			thisNode.addEventListener("stxtap", handleCaptureTap, true);
		}

		/**
		 * Captures a tap event *before* it descends down to what it is clicked on. The key thing this does is determine
		 * whether the thing clicked on was inside of a "cq-no-close" section. We do this on the way down, because the act
		 * of clicking on something may release it from the dom, making it impossible to figure out on propagation.
		 * @param {object} e Element
		 * @private
		 */
		captureTap(e) {
			var target = $(e.target);
			var domChain = target.parents().addBack();
			// Determine if the tapped element, or any of its parents have a cq-no-close attribute
			this.noClose = domChain.filter(function () {
				var attr = $(this).attr("cq-no-close");
				return typeof attr !== typeof undefined && attr !== false;
			}).length;

			// Determine if the tapped element was inside of something untappable, like a cq-heading or cq-separator
			if (!this.noClose) {
				this.noClose = domChain.filter(function () {
					return $(this).is("cq-separator,cq-heading");
				}).length;
			}
		}

		close() {
			this.uiManager.closeMenu(this);
		}

		hide() {
			if (!this.active) return;
			this.unlift();
			this.node.removeClass(this.activeClassName);
			this.active = false;
			// blur any input boxes that are inside the menu we're closing, to get rid of soft keyboard
			$(this)
				.find("input")
				.each(function () {
					if (this == document.activeElement) this.blur();
				});
		}

		lift() {
			var lifts = (this.lifts = this.uiManager.findLifts(this));
			for (var i = 0; i < lifts.length; i++) {
				this.uiManager.lift(lifts[i]);
			}
		}

		open(params) {
			var stack = this.uiManager.activeMenuStack;
			for (var i = 0; i < stack.length; i++) {
				if (stack[i] === this) return;
			}
			this.uiManager.openMenu(this, params);
		}

		show(params) {
			if (this.active) return;
			this.active = true;
			this.node.addClass(this.activeClassName);
			this.lift();
			// For good measure, call resize on any nested scrollables to give them
			// a chance to change their height and scrollbars
			var scrolls = this.node.find("cq-scroll");
			scrolls.each(function () {
				this.resize();
			});
		}

		tap(e) {
			var uiManager = this.uiManager;
			if (this.active) {
				// tapping on the menu if it is open will close it
				e.stopPropagation();
				if (!this.noClose) uiManager.closeMenu(this);
			} else if (!this.active) {
				// if we've clicked on the label for the menu, then open the menu
				e.stopPropagation();

				// If the tap came from within this menu's cq-menu-dropdown then this is probably an accidental
				// "re-open", which occurs when a click on a menu item causes an action that closes the menu, tricking
				// it into thinking it should re-open
				var target = $(e.target);
				var insideDropdown = target.parents("cq-menu-dropdown");
				if (insideDropdown.length) return;

				var child = false;
				var parents = this.node.parents("cq-menu,cq-dialog");
				for (var i = 0; i < parents.length; i++) {
					if (parents[i].active) child = true;
				}
				if (!child) uiManager.closeMenu(); // close all menus unless we're the child of an active menu (cascading)

				this.open();
			}
		}

		unlift() {
			var lifts = this.lifts;
			if (!lifts) return;
			for (var i = 0; i < lifts.length; i++) {
				this.uiManager.restoreLift(lifts[i]);
			}
			this.lifts = null;
		}
	}

	CIQ.UI.Menu = Menu;
	customElements.define("cq-menu", Menu);

	/**
	 * Redo web component `<cq-redo>`.
	 *
	 * Pairs with {@link WebComponents.cq-undo} to redo changes to a drawing.
	 * @namespace WebComponents.cq-redo
	 * @example
	 <cq-undo-section>
		 <cq-undo class="ciq-btn">Undo</cq-undo>
		 <cq-redo class="ciq-btn">Redo</cq-redo>
	 </cq-undo-section>
	 */
	class Redo extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		/**
		 * Finds {@link WebComponents.cq-undo} and pairs with it to find the last undo and reverse it.
		 * @alias pairUp
		 * @memberof WebComponents.cq-redo
		 * @example
		$("cq-redo")[0].pairUp($("cq-undo"));
		 */
		pairUp(undo) {
			this.undo = $(undo)[0];
			this.undo.redoButton = this;
			var self = this;
			$(this).stxtap(function () {
				self.undo.redo();
			});
		}
	}

	CIQ.UI.Redo = Redo;
	customElements.define("cq-redo", Redo);

	/**
	 * Scroll web component `<cq-scroll>`.
	 *
	 * cq-scroll web component creates an scrollable container. This will resize
	 * itself when the screen is resized. If perfect-scrollbar
	 * is supported then it will be used to replace the native scrollbar
	 *
	 * Attributes:
	 * cq-no-claim - Do not apply any keystroke capturing.
	 * cq-no-maximize - Do not automatically maximize the height (but keep it showing on screen)
	 * cq-no-resize - Do not apply any sizing logic.
	 *
	 * Use this.dataPortion to dynamically inject items into the list
	 * @namespace WebComponents.cq-scroll
	 * @example
	 <cq-lookup-results>
		 <cq-lookup-filters cq-no-close>
			 <cq-filter class="true">ALL</cq-filter>
			 <cq-filter>STOCKS</cq-filter>
			 <cq-filter>FX</cq-filter>
			 <cq-filter>INDEXES</cq-filter>
			 <cq-filter>FUNDS</cq-filter>
			 <cq-filter>FUTURES</cq-filter>
		 </cq-lookup-filters>
		 <cq-scroll></cq-scroll>
	 * @since 6.1.0 added cq-no-claim attribute
	 */
	class Scroll extends CIQ.UI.BaseComponent {
		constructor() {
			super();
			this.node = $(this);
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			if (typeof this.node.attr("cq-no-scroll") != "undefined") return;
			// Setting CSS in constructor will throw exception when calling document.createElement (done in plugins)
			// So set default CSS here when connected instead.
			this.node.css({ "overflow-y": "auto" });
			this.uiManager = $("cq-ui-manager");
			if (this.uiManager.length > 0) this.uiManager = this.uiManager[0];

			var node = this.node;
			if (node.perfectScrollbar) node.perfectScrollbar({ suppressScrollX: true });
			if (typeof node.attr("cq-no-claim") == "undefined") this.addClaim(this);

			// prevent mousewheel event from propagating up to parents, such as when embedded in a chart
			this.addEventListener(CIQ.wheelEvent, function (e) {
				e.stopPropagation();
			});

			var self = this;
			CIQ.addResizeListener(this, function () {
				self.resize();
			});
			this.resize();
		}

		/**
		 * Returns the focused element or null. An item is focused if it has
		 * attribute cq-focused.
		 * @return {HTMLElement} The element or null
		 * @alias focused
		 * @memberof WebComponents.cq-scroll
		 */
		focused() {
			var focused = this.node.find("cq-item[cq-focused]");
			if (focused.length) return focused[0];
			return null;
		}

		/**
		 * Scroll components can handle up and down enter keystrokes.
		 * They do not register for claims directly. Another section of code must
		 * establish the claim on their behalf or proxy the keystroke.
		 *
		 * Up and down arrows will iterate through cq-item tags. The attribute
		 * cq-focused will be added to the currently focused tag. This can then be
		 * queried later, such as when a user hits enter.
		 *
		 * space bar or enter will call the selectFC callback on the cq-item if it exists
		 * @param {undefined} hub Unused parameter
		 * @param {string} key Key that was stroked
		 * @param {object} e The event object
		 * @return {boolean}
		 */
		keyStroke(hub, key, e) {
			var node = this.node;

			if (!node.is(":trulyvisible")) return false;
			switch (key) {
				case "ArrowUp":
				case "ArrowDown":
				case "Enter":
				case " ":
				case "Up":
				case "Down":
				case "Spacebar":
					break;
				default:
					return false;
			}
			var items = node.find("cq-item");
			if (!items.length) return;
			var focused = node.find("cq-item[cq-focused]");

			if (key == " " || key == "Spacebar" || key == "Enter") {
				if (focused.length && focused[0].selectFC) {
					focused[0].selectFC.call(focused, e);
					return true;
				}
				return false;
			}
			if (!focused.length) {
				$(items[0]).attr("cq-focused", "true");
				this.scrollToElement(items[0]);
				return true;
			}
			items.removeAttr("cq-focused");

			// locate our location in the list of items
			for (var i = 0; i < items.length; i++) if (items[i] === focused[0]) break;

			if (key == "ArrowUp" || key == "Up") {
				i--;
				if (i < 0) i = 0;
			}
			if (key == "ArrowDown" || key == "Down") {
				i++;
				if (i >= items.length) i = items.length - 1;
			}
			$(items[i]).attr("cq-focused", "true");
			this.scrollToElement(items[i]);
			return true;
		}

		resize() {
			var node = this.node;
			if (node.parents(".sharing").length)
				return; /*share.js appends this class to the body.
			Do not attempt unnecessary resize of scroll
			for a chart about to become a shared image.
			Besides, jquery will choke on offset() below.*/
			if (typeof node.attr("cq-no-resize") != "undefined") return;
			if (typeof node.attr("cq-no-maximize") != "undefined") this.noMaximize = true;
			var position = node[0].getBoundingClientRect();
			var reduceMenuHeight = node.prop("reduceMenuHeight") || 45; // defaulted to 45 to take into account 15px of padding on menus and then an extra 5px for aesthetics
			var winHeight = $(window).height();
			if (!winHeight) return;
			var height = winHeight - position.top - reduceMenuHeight;
			var holders = node.parents(".stx-holder,.stx-subholder,.chartContainer");
			if (holders.length) {
				holders.each(function () {
					var h = $(this);
					var holderBottom = h[0].getBoundingClientRect().top + h.height();
					height = Math.min(height, holderBottom - position.top - 5); // inside a holder we ignore reduceMenuHeight, but take off 5 pixels just for aesthetics
				});
			}

			// If there are subsequent siblings that have a fixed height then make room for them
			var nextAll = node.nextAll();
			for (var i = 0; i < nextAll.length; i++) {
				var sibling = $(nextAll[i]);
				if (!sibling.is(":visible")) continue; // skip hidden siblings
				height -= sibling.height();
			}
			if (!this.noMaximize) node.css({ height: height + "px" });
			node.css({ "max-height": height + "px" });
			if (node.perfectScrollbar) node.perfectScrollbar("update");
		}

		/**
		 * Scroll to the element.
		 * @param  {HtmlElement} item The element to scroll to. Must be a child.
		 * @alias scrollToElement
		 * @memberof WebComponents.cq-scroll
		 */
		scrollToElement(item) {
			var bottom = this.clientHeight,
				scrolled = this.scrollTop;
			var itemBottom = item.offsetTop + item.clientHeight;
			if (item.offsetTop > scrolled && itemBottom < bottom + scrolled) return;
			this.scrollTop = Math.max(itemBottom - bottom, 0);
			if (this.node.perfectScrollbar) this.node.perfectScrollbar("update");
		}

		/**
		 * Scroll back to top
		 */
		top() {
			this.scrollTop = 0;
			if (this.node.perfectScrollbar) this.node.perfectScrollbar("update");
		}
	}

	CIQ.UI.Scroll = Scroll;
	customElements.define("cq-scroll", Scroll);

	/**
	 * Share Button web component `<cq-share-button>`.
	 *
	 * @namespace WebComponents.cq-share-button
	 * @example
	 <cq-share-button>
		 <div stxtap="tap();">Share</div>
	 </cq-share-button>
	 */
	class ShareButton extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		/**
		 * Opens a customizable dialog that can share a chart.
		 * @alias tap
		 * @memberof WebComponents.cq-share-button
		 */
		tap(e) {
			var context = this.context;
			$("cq-share-dialog").each(function () {
				this.open({ context: context });
			});
		}
	}

	CIQ.UI.ShareButton = ShareButton;
	customElements.define("cq-share-button", ShareButton);

	/**
	 * Share Dialog web component `<cq-share-dialog>`.
	 *
	 * @namespace WebComponents.cq-share-dialog
	 * @example
	 <cq-dialog>
	 	<cq-share-dialog>
	 		<div>
	 			<h4 class="title">Share Your Chart</h4>
	 			<cq-separator></cq-separator>
	 			<p>Press this button to generate a shareable image:</p>
	 				<div class="ciq-btn" stxtap="share()">
	 						Create Image
	 				</div>

	 			<div class="share-link-div"></div>

	 			<cq-separator></cq-separator>
	 			<div class="ciq-dialog-cntrls">
	 				<div stxtap="close()" class="ciq-btn">Done</div>
	 			</div>

	 		</div>
	 	</cq-share-dialog>
	 </cq-dialog>
	 */
	class ShareDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		close() {
			$("cq-share-dialog .share-link-div").html("");
			super.close();
		}

		setState(state) {
			this.node.find("cq-share-create").css({ display: "none" });
			this.node.find("cq-share-generating").css({ display: "none" });
			this.node.find("cq-share-uploading").css({ display: "none" });
			this.node.find("cq-share-" + state).css({ display: "inline-block" });
		}

		/**
		 * Shares a chart with default parameters
		 * @alias share
		 * @memberof WebComponents.cq-share-dialog
		 */
		share() {
			var stx = this.context.stx;
			var self = this;
			this.setState("generating");
			$("cq-share-dialog .share-link-div").html("");
			// "hide" is a selector list, of DOM elements to be hidden while an image of the chart is created.  "cq-comparison-add-label" and ".chartSize" are hidden by default.
			CIQ.UI.bypassBindings = true;
			CIQ.Share.createImage(
				stx,
				{
					hide: [".stx_chart_controls", ".stx-btn-panel", ".stx_jump_today", ".stx-baseline-handle"],
				},
				function (data) {
					CIQ.UI.bypassBindings = false;
					var id = CIQ.uniqueID();
					var host = "https://share.chartiq.com";
					var startOffset = stx.getStartDateOffset();
					var metaData = {
						layout: stx.exportLayout(),
						drawings: stx.exportDrawings(),
						xOffset: startOffset,
						startDate: stx.chart.dataSegment[startOffset].Date,
						endDate: stx.chart.dataSegment[stx.chart.dataSegment.length - 1].Date,
						id: id,
						symbol: stx.chart.symbol,
					};
					var url = host + "/upload/" + id;
					var payload = { id: id, image: data, config: metaData };

					self.setState("uploading");
					CIQ.Share.uploadImage(data, url, payload, function (err, response) {
						self.setState("create");
						if (err !== null) {
							CIQ.alert("error: " + err);
						} else {
							$("cq-share-dialog .share-link-div").html(host + response);
						}
					});
				}
			);
		}
	}

	CIQ.UI.ShareDialog = ShareDialog;
	customElements.define("cq-share-dialog", ShareDialog);

	/**
	 * Aggregation Dialog web component `<cq-aggregation-dialog>`.
	 *
	 * @namespace WebComponents.cq-aggregation-dialog
	 */
	class AggregationDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * Opens the nearest {@link WebComponents.cq-dialog} to display your dialog.
		 * @alias open
		 * @memberof WebComponents.cq-aggregation-dialog
		 */
		open(params) {
			super.open(params);
			var stx = this.context.stx;
			var aggregationType = params.aggregationType;
			var map = {
				kagi: {
					title: "Set Reversal Percentage",
				},
				renko: {
					title: "Set Brick Size",
				},
				linebreak: {
					title: "Set Price Lines",
				},
				rangebars: {
					title: "Set Range",
				},
				pandf: {
					title: "Set Point & Figure Parameters",
				},
			};
			if (stx.layout.aggregationType != aggregationType) stx.setAggregationType(aggregationType);

			var entry = map[aggregationType];
			var node = this.node;
			node.find(".title").text(stx.translateIf(entry.title));

			for (var type in map) {
				node.find(".ciq" + type).css(aggregationType === type ? { display: "" } : { display: "none" });
			}
			node.find(".ciq" + aggregationType + " input").each(function () {
				var name = this.name;
				if (name == "box" || name == "reversal") name = "pandf." + name;
				var tuple = CIQ.deriveFromObjectChain(stx.layout, name);
				if (tuple && !tuple.obj[tuple.member] && stx.chart.defaultChartStyleConfig[this.name])
					$(this).val(stx.chart.defaultChartStyleConfig[this.name]);
			});
		}
	}

	CIQ.UI.AggregationDialog = AggregationDialog;
	customElements.define("cq-aggregation-dialog", AggregationDialog);

	/**
	 * Side Panel web component `<cq-side-panel>`.
	 *
	 * @namespace WebComponents.cq-side-panel
	 * @example
	 	 <cq-side-panel><cq-side-panel>
	 */
	class SidePanel extends CIQ.UI.ContextTag {
		constructor() {
			super();
			this.callbacks = [];
			window.addEventListener(
				"resize",
				(function (self) {
					var cb = self.resizeMyself.bind(self);
					return function () {
						setTimeout(cb, 0);
					};
				})(this)
			);
		}

		close() {
			this.node.removeAttr("cq-active");
			var children = this.node.children();
			children.each(function () {
				if (this.sidePanelActiveClass) $(this).removeClass(this.sidePanelActiveClass);
				// turn off a child by removing the class name added to it
				else $(this).removeAttr(this.sidePanelActiveAttribute); // turn off a child by removing the attribute name added to it
			});
			var self = this;
			setTimeout(function () {
				self.resizeMyself();
			}, 0);
		}

		/**
		 * Use this method to get the width instead of querying the node directly because the side panel may be animated.
		 * @return {number} The width
		 */
		nonAnimatedWidth() {
			var width = 0;
			this.node.children().width(function (i, w) {
				width += w;
			}); // accumulate width of all children
			return width;
		}

		/**
		 * Opens a side panel to show more options in mobile.
		 * @param  {Object} params Parameters
		 * @param {string} params.selector The selector for which child to enable
		 * @param {string} [params.className] The class name to add to turn on the panel
		 * @param {string} [params.attribute] The attribute to add to turn on the panel
		 * @alias open
		 * @memberof WebComponents.cq-side-panel
		 */
		open(params) {
			this.close();
			var children = this.node.find(params.selector);
			if (params.className) {
				children.addClass(params.className);
				children.each(function () {
					this.sidePanelActiveClass = params.className; // store the class name used to turn it on
				});
			} else {
				children.attr(params.attribute, "true");
				children.each(function () {
					this.sidePanelActiveAttribute = params.attribute; // store the attribute name used to turn it on
				});
			}
			this.node.attr("cq-active", "true");
			var self = this;
			setTimeout(function () {
				self.resizeMyself();
			}, 0);
		}

		registerCallback(fc) {
			this.callbacks.push(fc);
		}

		resizeMyself() {
			var width = 0;
			this.node.children().width(function (i, w) {
				width += w;
			}); // accumulate width of all children
			this.node.css({ width: width + "px" }); // expand the side panel
			for (
				var i = 0;
				i < this.callbacks.length;
				i++ // let any callbacks know that we've been resized
			)
				this.callbacks[i].call(this, width);
		}
	}

	/**
	 * A side panel contains children that should be enabled by calling open({selector:selector}).
	 */
	CIQ.UI.SidePanel = SidePanel;
	customElements.define("cq-side-panel", SidePanel);

	/**
	 * Studies List web component `<cq-studies>`.
	 *
	 * This web component lists all available studies from the study library CIQ.Studies.studyLibrary.
	 *
	 * @namespace WebComponents.cq-studies
	 * @since 5.2.0
	 * @example
			<cq-menu class="ciq-menu ciq-studies collapse">
				<span>Studies</span>
				<cq-menu-dropdown cq-no-scroll>
					<cq-study-legend cq-no-close>
						<cq-section-dynamic>
							<cq-heading>Current Studies</cq-heading>
							<cq-study-legend-content>
								<template>
									<cq-item>
										<cq-label class="click-to-edit"></cq-label>
										<div class="ciq-icon ciq-close"></div>
									</cq-item>
								</template>
							</cq-study-legend-content>
							<cq-placeholder>
								<div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
							</cq-placeholder>
						</cq-section-dynamic>
					</cq-study-legend>
					<cq-scroll>
						<cq-studies>
							<cq-studies-content>
								<template>
									<cq-item>
										<cq-label></cq-label>
									</cq-item>
								</template>
							</cq-studies-content>
						</cq-studies>
					</cq-scroll>
				</cq-menu-dropdown>
			</cq-menu>
	 */
	class Studies extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		/**
		 * Initialize the Studies list.
		 *
		 * @param {Object} [params] Parameters to control behavior of the menu
		 * @param {Object} [params.excludedStudies] A map of study names that should not be put in the menu.
		 * @param {Boolean} [params.alwaysDisplayDialog=false] If set to true then, the study will automatically be added to the chart, but a dialog will also always be displayed to allow the end user to pick their study parameters. Otherwise the study will be created automatically with defaults. Can optionally be an object containing a map of which studys to always display the dialog for.
		 * @param {Boolean} [params.dialogBeforeAddingStudy=false] If set to true then a dialog will be displayed before the study is added to the chart. This can optionally be a map of which studies require a dialog before adding.
		 * @memberof WebComponents.cq-studies
		 * @since 5.2.0 CIQ.UI.StudyMenu helper has been deprecated. Please call $("cq-studies")[0].initialize() now.
		 * @example
		var params={
			excludedStudies: {
				"Directional": true,
				"Gopala":true,
				"vchart":true
			},
			alwaysDisplayDialog: {"ma":true}, 		// this is how to always show a dialog before adding the study
			dialogBeforeAddingStudy: {"rsi": true} 	// this is how to always show a dialog before adding the study
		};
		$("cq-studies").each(function(){
			this.initialize(params);
		});
		 */
		initialize(params) {
			this.params = params || {};
			this.alwaysDisplayDialog = this.params.alwaysDisplayDialog || false;
			this.excludedStudies = this.params.excludedStudies || [];
			if (!this.params.template) this.params.template = "template";
			this.params.template = this.node.find(this.params.template);
			this.params.template.detach();
			this.renderMenu();

			var self = this;

			CIQ.UI.observe({
				obj: CIQ.Studies.studyLibrary,
				action: "callback",
				value: function () {
					self.renderMenu();
				},
			});
		}

		/**
		 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
		 * CIQ.UI.Studies for processing stxtap attributes, or you can call renderMenu() to automatically
		 * generate the menu.
		 * @memberof WebComponents.cq-studies
		 */
		renderMenu() {
			var stx = this.context.stx;
			var alphabetized = [];
			var sd;

			for (var field in CIQ.Studies.studyLibrary) {
				sd = CIQ.Studies.studyLibrary[field];
				if (!sd || this.excludedStudies[field] || this.excludedStudies[sd.name] || sd.siqList !== undefined) continue; // siqList = ScriptIQ entry
				if (!sd.name) sd.name = field; // Make sure there's always a name
				alphabetized.push(field);
			}
			alphabetized.sort(function (lhs, rhs) {
				var lsd = CIQ.Studies.studyLibrary[lhs];
				var rsd = CIQ.Studies.studyLibrary[rhs];
				if (lsd.name < rsd.name) return -1;
				if (lsd.name > rsd.name) return 1;
				return 0;
			});
			var menu = $(this.node);
			var self = this;
			var tapFn = function (studyName, context) {
				return function (e) {
					pickStudy(e.target, studyName);
					menu.resize();
				};
			};

			var contentNode = menu.find("cq-studies-content");
			while (contentNode.length > 0 && contentNode[0].firstChild) {
				contentNode[0].removeChild(contentNode[0].firstChild);
			}

			for (var i = 0; i < alphabetized.length; i++) {
				var menuItem = CIQ.UI.makeFromTemplate(this.params.template);
				sd = CIQ.Studies.studyLibrary[alphabetized[i]];
				menuItem.append(CIQ.translatableTextNode(stx, sd.name));
				this.makeTap(menuItem[0], tapFn(alphabetized[i], this.context));
				menu.find("cq-studies-content").append(menuItem);
			}

			function studyDialog(params, addWhenDone) {
				params.context = self.context;
				$("cq-study-dialog").each(function () {
					this.addWhenDone = addWhenDone;
					this.open(params);
				});
			}

			function pickStudy(node, studyName) {
				var stx = self.context.stx;

				function handleSpecialCase(flag, params, addWhenDone) {
					if (flag === true) {
						studyDialog(params, addWhenDone);
						return true;
					} else if (typeof flag === "object") {
						for (var i in flag) {
							if (i == studyName && flag[i]) {
								studyDialog(params, addWhenDone);
								return true;
							}
						}
					}
				}

				if (handleSpecialCase(self.params.dialogBeforeAddingStudy, { stx: stx, name: studyName }, true)) return;
				var sd = CIQ.Studies.addStudy(stx, studyName);
				handleSpecialCase(self.alwaysDisplayDialog, { sd: sd, stx: stx });
			}
		}
	}

	CIQ.UI.StudiesComponent = Studies;
	customElements.define("cq-studies", Studies);

	/**
	 * Study Context Dialog web component `<cq-study-context>`.
	 *
	 *
	 * @namespace WebComponents.cq-study-context
	 * @since  4.1.0 cq-study-context is now required (cq-dialog[cq-study-context] no longer works)
	 */
	class StudyContext extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}
	}

	CIQ.UI.StudyContext = StudyContext;
	customElements.define("cq-study-context", StudyContext);

	/**
	 * Study Dialogs web component `<cq-study-dialog>`.
	 *
	 * Creates and manages Study Dialogs based on the corresponding study library entry
	 * (title, inputs, outputs, parameters, etc).
	 *
	 *  Requires {@link CIQ.UI.StudyEdit} ( See `startUI()` in `sample-template-advanced.html` for exact location and signature )
	 *
	 * Optional Attributes:
	 * - `cq-study-axis`  : Displays UI for selecting the Y-axis position (left, right, etc), color and for inverting the Y-axis **if not shared with the primary axis**.
	 * - `cq-study-panel` : Displays UI for selecting the panel for the study (own, shared, etc) and if it will be rendered as an underlay (under the primary chart) or an overlay (over the primary chart).
	 *
	 * @namespace WebComponents.cq-study-dialog
	 * @example
	 	<caption>
		Here is an example of how to create a study dialog.
		We set the `cq-study-axis` and `cq-study-panel` attributes to enable form fields used to control axis position, color, study panel, and underlay/overlay.
		</caption>
<cq-dialog>
	<cq-study-dialog cq-study-axis cq-study-panel>
		<h4 class="title">Study</h4>
		<cq-scroll cq-no-maximize>
			<cq-study-inputs>
				<template cq-study-input>
					<cq-study-input>
						<div class="ciq-heading"></div>
						<div class="stx-data">
							<template cq-menu>
								<cq-menu class="ciq-select">
									<cq-selected></cq-selected>
									<cq-menu-dropdown cq-lift></cq-menu-dropdown>
								</cq-menu>
							</template>
						</div>
					</cq-study-input>
				</template>
			</cq-study-inputs>
			<hr>
			<cq-study-outputs>
				<template cq-study-output>
					<cq-study-output>
						<div class="ciq-heading"></div>
						<cq-swatch cq-overrides="auto"></cq-swatch>
					</cq-study-output>
				</template>
			</cq-study-outputs>
			<hr>
			<cq-study-parameters>
				<template cq-study-parameters>
					<cq-study-parameter>
						<div class="ciq-heading"></div>
						<div class="stx-data"><cq-swatch cq-overrides="auto"></cq-swatch>
							<template cq-menu>
								<cq-menu class="ciq-select">
									<cq-selected></cq-selected>
									<cq-menu-dropdown cq-lift></cq-menu-dropdown>
								</cq-menu>
							</template>
						</div>
					</cq-study-parameter>
				</template>
			</cq-study-parameters>
		</cq-scroll>
		<div class="ciq-dialog-cntrls">
			<div class="ciq-btn" stxtap="close()">Done</div>
		</div>
	</cq-study-dialog>
</cq-dialog>
	 * @since
	 * <br>&bull; 5.2.0 Optional Attributes `cq-study-axis` and `cq-study-panel` are now available.
	 * <br>&bull; 6.3.0 `cq-study-axis`  now also provides a check box allowing users to invert study Y-axis if not shared with the primary axis.
	 */
	class StudyDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			var dialog = $(this);
			this.inputTemplate = dialog.find("template[cq-study-input]");
			this.outputTemplate = dialog.find("template[cq-study-output]");
			this.parameterTemplate = dialog.find("template[cq-study-parameters]");
			this.queuedUpdates = {};
		}

		close() {
			if (this.addWhenDone) {
				var helper = this.helper;
				var sd = CIQ.Studies.addStudy(helper.stx, helper.name);
				if (!CIQ.isEmpty(this.queuedUpdates)) {
					helper.sd = sd;
					helper.updateStudy(this.queuedUpdates);
					this.queuedUpdates = {};
				}
			}
		}

		hide() {
			if (!CIQ.isEmpty(this.queuedUpdates)) {
				this.helper.updateStudy(this.queuedUpdates);
				this.queuedUpdates = {};
			}
			this.node.find("cq-menu").each(function () {
				if (this.unlift) this.unlift();
			});
			this.node.find("cq-swatch").each(function () {
				if (this.colorPicker) this.colorPicker.close();
			});
		}

		open(params) {
			super.open(params);
			params.axisSelect = this.hasAttribute("cq-study-axis");
			params.panelSelect = this.hasAttribute("cq-study-panel");
			// Generate a "helper" which tells us how to create a dialog
			this.helper = new CIQ.Studies.DialogHelper(params);
			var dialog = $(this);

			dialog.find(".title").text(this.helper.title);

			var self = this;
			function makeMenu(name, currentValue, fields, section) {
				var menu = CIQ.UI.makeFromTemplate(self.menuTemplate);
				var cqMenu = menu.find("cq-menu-dropdown"); // scrollable in menu.
				for (var field in fields) {
					var item = $("<cq-item></cq-item>");
					item.text(fields[field]);
					item.attr("stxtap", "StudyDialog.setSelectOption('" + section + "')"); // must call StudyDialog because the item is "lifted" and so doesn't know its parent
					cqMenu.append(item);
					item[0].cqMenuWrapper = cqMenu.parents("cq-menu")[0];
					item.attr("name", name);
					item.attr("value", field);
					item[0].context = self.context;
				}
				var inputValue = menu.find("cq-selected");
				inputValue.text(self.helper.stx.translateIf(currentValue));
				return menu;
			}

			// Create form elements for all of the inputs
			var attributes;
			var inputs = dialog.find("cq-study-inputs");
			var i;
			function formatDateInput(date) {
				date = date.replace(/-/g, "");
				if (!date.search(/^\d{8}$/))
					date = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
				return date;
			}
			function formatTimeInput(time) {
				time = time.replace(/:/g, "");
				if (!time.search(/^\d{4,6}$/))
					time =
						time.substring(0, 2) + ":" + time.substring(2, 4) + (time.length == 4 ? "" : ":" + time.substring(4, 6));
				return time;
			}
			inputs.empty();
			for (i = 0; i < this.helper.inputs.length; i++) {
				var input = this.helper.inputs[i];
				var newInput = CIQ.UI.makeFromTemplate(this.inputTemplate, inputs);
				this.menuTemplate = newInput.find("template[cq-menu]");
				newInput.find(".ciq-heading").text(input.heading);
				newInput[0].fieldName = input.name;
				var formField = null;

				var iAttr;
				attributes = this.helper.attributes[input.name];
				if (input.type == "number") {
					formField = $("<input>");
					formField.attr("type", "number");
					formField.val(input.value);
					this.setChangeEvent(formField, "inputs", input.name);
					for (iAttr in attributes) {
						var iAttrVal = attributes[iAttr];
						// poor IE/Edge can't perform decimal step validation properly, so we need to change step to any and give up the neat step effect
						if ((CIQ.isIE || CIQ.isEdge) && iAttr == "step" && Math.floor(iAttrVal) != iAttrVal) iAttrVal = "any";
						formField.attr(iAttr, iAttrVal);
					}
				} else if (input.type == "text" || input.type == "date" || input.type == "time") {
					formField = $("<input>");
					formField.attr("type", CIQ.UI.supportedInputType(input.type));
					if (input.type == "date") formField.val(formatDateInput(input.value));
					else if (input.type == "time") formField.val(formatTimeInput(input.value));
					else formField.val(input.value);
					this.setChangeEvent(formField, "inputs", input.name);
					for (iAttr in attributes) formField.attr(iAttr, attributes[iAttr]);
				} else if (input.type == "select") {
					formField = makeMenu(input.name, input.value, input.options, "inputs");
					if (attributes && attributes.readonly) formField.attr("readonly", attributes.readonly);
				} else if (input.type == "checkbox") {
					formField = $("<input>");
					formField.attr("type", "checkbox");
					if (input.value) formField.prop("checked", true);
					this.setChangeEvent(formField, "inputs", input.name);
					for (iAttr in attributes) formField.attr(iAttr, attributes[iAttr]);
				}
				if (attributes && attributes.hidden) newInput.hide();
				if (formField) newInput.find(".stx-data").append(formField);
			}
			var swatch;
			var outputs = dialog.find("cq-study-outputs");
			outputs.empty();
			for (i = 0; i < this.helper.outputs.length; i++) {
				var output = this.helper.outputs[i];
				var newOutput = CIQ.UI.makeFromTemplate(this.outputTemplate, outputs);
				newOutput[0].initialize({
					studyDialog: this,
					output: output.name,
					params: params,
				});
				newOutput.find(".ciq-heading").text(output.heading);
				newOutput.find(".ciq-heading")[0].fieldName = output.name;

				swatch = newOutput.find("cq-swatch");
				var color = output.color;
				if (typeof color === "object") {
					color = color.color;
				}
				swatch[0].setColor(color, false); // don't percolate
			}

			var parameters = dialog.find("cq-study-parameters");
			parameters.empty();
			for (i = 0; i < this.helper.parameters.length; i++) {
				var parameter = this.helper.parameters[i];
				var newParam = CIQ.UI.makeFromTemplate(this.parameterTemplate, parameters);
				this.menuTemplate = newParam.find("template[cq-menu]");
				if (!this.menuTemplate.length && parameter.options) {
					newParam.remove();
					continue;
				}
				newParam.find(".ciq-heading").text(parameter.heading);
				swatch = newParam.find("cq-swatch");
				var paramInput = $("<input>");
				var pAttr;
				attributes = {};
				if (parameter.defaultValue.constructor == Boolean) {
					paramInput.attr("type", "checkbox");
					if (parameter.value) paramInput.prop("checked", true);
					this.setChangeEvent(paramInput, "parameters", parameter.name + "Enabled");
					swatch.remove();

					attributes = this.helper.attributes[parameter.name + "Enabled"];
					for (pAttr in attributes) paramInput.attr(pAttr, attributes[pAttr]);
				} else if (parameter.defaultValue.constructor == String) {
					var paramName = parameter.name;
					if (parameter.defaultColor) {
						newParam[0].initialize({
							studyDialog: this,
							parameter: parameter.name + "Color",
							params: params,
						});
						swatch[0].setColor(parameter.color, false); // don't percolate
						paramName = paramName + "Value";
					} else {
						swatch.remove();
					}
					if (parameter.options) {
						paramInput = makeMenu(paramName, parameter.value, parameter.options, "parameters");
					} else {
						paramInput.val(parameter.value);
					}
					attributes = this.helper.attributes[paramName];
					for (pAttr in attributes) paramInput.attr(pAttr, attributes[pAttr]);
				} else if (parameter.defaultValue.constructor == Number) {
					paramInput.attr("type", "number");
					paramInput.val(parameter.value);
					this.setChangeEvent(paramInput, "parameters", parameter.name + "Value");
					newParam[0].initialize({
						studyDialog: this,
						parameter: parameter.name + "Color",
						params: params,
					});
					swatch[0].setColor(parameter.color, false); // don't percolate

					attributes = this.helper.attributes[parameter.name + "Value"];
					for (pAttr in attributes) {
						var pAttrVal = attributes[pAttr];
						// poor IE/Edge can't perform decimal step validation properly, so we need to change step to any and give up the neat step effect
						if ((CIQ.isIE || CIQ.isEdge) && pAttr == "step" && Math.floor(pAttrVal) != pAttrVal) pAttrVal = "any";
						paramInput.attr(pAttr, pAttrVal);
					}
				} else continue;

				if (attributes && attributes.hidden) newParam.hide();
				newParam.find(".stx-data").append(paramInput);
			}
		}

		/**
		 * Sets up a handler to process changes to input fields
		 * @param {HTMLElement} node    The input field
		 * @param {string} section The section that is being updated, "inputs","outputs","parameters"
		 * @param {string} name    The name of the field being updated
		 * @memberof! WebComponents.cq-study-dialog
		 * @private
		 */
		setChangeEvent(node, section, name) {
			var self = this;
			function closure() {
				return function () {
					var updates = {};
					updates[section] = {};
					updates[section][name] = this.value;
					if (this.type == "checkbox" || this.type == "radio") {
						updates[section][name] = this.checked;
					}
					self.updateStudy(updates);
				};
			}
			node.change(closure());
		}

		setContext(context) {
			this.context = context;
			context.advertiseAs(this, "StudyDialog");
		}

		/**
		 * Accepts new menu (select box) selections
		 * @param {object} activator
		 * @param {string} section within the dialog ("inputs", "outputs", "parameters")
		 * @memberof! WebComponents.cq-study-dialog
		 * @since 5.2.0 added section argument
		 */
		setSelectOption(activator, section) {
			var node = $(activator.node);
			var name = node.attr("name");
			var value = node.attr("value");
			var newInput = $(node[0].cqMenuWrapper);
			var inputValue = newInput.find("cq-selected");
			inputValue.text(this.helper.stx.translateIf(value));
			newInput[0].fieldValue = value;
			if (!section) section = "inputs";
			var updates = {};
			updates[section] = {};
			updates[section][name] = value;
			this.updateStudy(updates);
		}

		updateStudy(updates) {
			if ($(this).find(":invalid").length) return;
			if (this.addWhenDone) {
				CIQ.extend(this.queuedUpdates, updates);
				return;
			}
			if (this.helper.libraryEntry.deferUpdate) {
				CIQ.extend(this.queuedUpdates, { inputs: updates.inputs });
				this.helper.updateStudy({
					outputs: updates.outputs,
					parameters: updates.parameters,
				});
			} else {
				this.helper.updateStudy(updates);
			}
		}
	}

	CIQ.UI.StudyDialog = customElements.define("cq-study-dialog", StudyDialog);

	/**
	 * Study input web component `<cq-study-input>`.
	 *
	 * See example in {@link WebComponents.cq-study-dialog}.
	 * @namespace WebComponents.cq-study-input
	 */
	class StudyInput extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}
	}

	CIQ.UI.StudyInput = StudyInput;
	customElements.define("cq-study-input", StudyInput);

	/**
	 * Study legend web component `<cq-study-legend>`.
	 *
	 * Click on the "X" to remove the study.
	 * Click on the cog to edit the study.
	 * Optionally only show studies needing custom Removal. cq-custom-removal-only
	 * Optionally only show overlays. cq-overlays-only
	 * Optionally only show studies in this panel. cq-panel-only
	 *
	 * @namespace WebComponents.cq-study-legend
	 * @example
	    <caption>
		Here is an example of how to create a study legend on the chart.
		We use the `cq-marker` attribute to ensure that it floats inside the chart.
		We set the optional `cq-panel-only` attribute so that only studies from
		this panel are displayed.
		</caption>
<cq-study-legend cq-marker-label="Studies" cq-overlays-only cq-marker cq-hovershow>
	<template>
		<cq-item>
			<cq-label></cq-label>
			<span class="ciq-edit"></span>
			<div class="ciq-icon ciq-close"></div>
		</cq-item>
	</template>
</cq-study-legend>
	 * @example
	    <caption>
		Here is an example of how to create a study legend inside a drop down menu.
		We use the `cq-no-close` attribute so that drop down is not closed when the user removes a study from the list.
		</caption>
<cq-menu class="ciq-menu ciq-studies collapse">
	<span>Studies</span>
	<cq-menu-dropdown cq-no-scroll>
		<cq-study-legend cq-no-close>
			<cq-section-dynamic>
				<cq-heading>Current Studies</cq-heading>
				<cq-study-legend-content>
					<template>
						<cq-item>
							<cq-label class="click-to-edit"></cq-label>
							<div class="ciq-icon ciq-close"></div>
						</cq-item>
					</template>
				</cq-study-legend-content>
				<cq-placeholder>
					<div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
				</cq-placeholder>
			</cq-section-dynamic>
		</cq-study-legend>
		<cq-scroll>
			<cq-studies>
				<cq-studies-content>
					<template>
						<cq-item>
							<cq-label></cq-label>
						</cq-item>
					</template>
				</cq-studies-content>
			</cq-studies>
		</cq-scroll>

	</cq-menu-dropdown>
</cq-menu>
	 *
	 */
	class StudyLegend extends CIQ.UI.ModalTag {
		constructor() {
			super();
		}

		/**
		 * Begins running the StudyLegend.
		 * @memberof! WebComponents.cq-study-legend
		 * @private
		 */
		begin() {
			var self = this;
			self.template = self.node.find("template");
			function render() {
				self.showHide();
				self.renderLegend();
			}
			this.context.stx.addEventListener("layout", render);
			if (self.node[0].hasAttribute("cq-marker")) {
				self.node.stxtap(function (e) {
					self.node.toggleClass("ciq-active");
				});
			}
			render();
		}

		/**
		 * Renders the legend based on the current studies in the CIQ.ChartEngine object.
		 * @memberof! WebComponents.cq-study-legend
		 */
		renderLegend() {
			var stx = this.context.stx;
			if (!stx.layout.studies) return;

			$(this.template).nextAll().remove();

			function closeStudy(self, sd) {
				return function (e) {
					// Need to run this in the nextTick because the study legend can be removed by this click
					// causing the underlying chart to receive the mousedown (on IE win7)
					setTimeout(function () {
						if (!sd.permanent) CIQ.Studies.removeStudy(self.context.stx, sd);
						if (self.node[0].hasAttribute("cq-marker")) self.context.stx.modalEnd();
						self.renderLegend();
					}, 0);
				};
			}
			function editStudy(self, studyId) {
				return function (e) {
					var sd = stx.layout.studies[studyId];
					if (sd.permanent || !sd.editFunction) return;
					e.stopPropagation();
					self.uiManager.closeMenu();
					var studyEdit = self.context.getAdvertised("StudyEdit");
					var params = {
						stx: stx,
						sd: sd,
						inputs: sd.inputs,
						outputs: sd.outputs,
						parameters: sd.parameters,
					};
					studyEdit.editPanel(params);
				};
			}
			var overlaysOnly = typeof this.node.attr("cq-overlays-only") != "undefined";
			var panelOnly = typeof this.node.attr("cq-panel-only") != "undefined";
			var customRemovalOnly = typeof this.node.attr("cq-custom-removal-only") != "undefined";
			var holder = this.node.parents(".stx-holder");
			var panelName = null;
			var markerLabel = this.node.attr("cq-marker-label");
			if (holder.length) {
				panelName = holder.attr("cq-panel-name");
			}

			for (var id in stx.layout.studies) {
				var sd = stx.layout.studies[id];
				if (sd.customLegend) continue;
				if (customRemovalOnly && !sd.study.customRemoval) continue;
				if (panelOnly && sd.panel != panelName) continue;
				if (overlaysOnly && !sd.overlay && !sd.underlay) continue;
				var newChild = CIQ.UI.makeFromTemplate(this.template, true);
				newChild.find("cq-label").html(sd.inputs.display);
				var close = newChild.find(".ciq-close");
				if (sd.permanent) {
					close.hide();
				} else {
					close.stxtap(closeStudy(this, sd));
				}
				var edit = newChild.find(".ciq-edit");
				if (!edit.length) edit = newChild.find("cq-label");
				edit.stxtap(editStudy(this, id));
			}
			//Only want to display the marker label if at least one study has been
			//rendered in the legend. If no studies are rendered, only the template tag
			//will be in there.
			if (typeof markerLabel != "undefined") {
				if (!this.node.find("cq-marker-label").length) {
					this.node.prepend("<cq-marker-label>" + markerLabel + "</cq-marker-label>");
				}
				if (this.node.find("cq-label").length) {
					this.node.find("cq-marker-label").show();
				} else {
					this.node.find("cq-marker-label").hide();
				}
			}
			CIQ.I18N.translateUI(null, this.node[0]);
			//this.context.resize();
			this.showHide();
		}

		showHide() {
			var node = this.node;
			for (var s in this.context.stx.layout.studies) {
				if (!this.context.stx.layout.studies[s].customLegend) {
					node.css({ display: "" });
					return;
				}
			}
			node.css({ display: "none" });
		}
	}

	CIQ.UI.StudyLegend = StudyLegend;
	customElements.define("cq-study-legend", StudyLegend);

	/**
	 * Study output web component `<cq-study-output>`.
	 *
	 * Set the color of study outputs in the {@link WebComponents.cq-study-dialog}.
	 *
	 * See example in {@link WebComponents.cq-study-dialog}.
	 * @namespace WebComponents.cq-study-output
	 */
	class StudyOutput extends CIQ.UI.BaseComponent {
		constructor() {
			super();
		}

		initialize(params) {
			this.params = params;
		}

		setColor(color) {
			if (!this.params) return;
			var updates = {
				outputs: {},
			};
			updates.outputs[this.params.output] = {};
			updates.outputs[this.params.output].color = color;
			this.params.studyDialog.updateStudy(updates);
		}
	}

	CIQ.UI.StudyOutput = StudyOutput;
	customElements.define("cq-study-output", StudyOutput);

	/**
	 * Study parameters web component `<cq-study-parameter>`.
	 *
	 * See example in {@link WebComponents.cq-study-dialog}.
	 @namespace WebComponents.cq-study-parameter
	 */
	class StudyParameter extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		initialize(params) {
			this.params = params;
		}

		setColor(color) {
			if (!this.params) return;
			var updates = { parameters: {} };
			updates.parameters[this.params.parameter] = color;
			this.params.studyDialog.updateStudy(updates);
		}
	}

	CIQ.UI.StudyParameter = StudyParameter;
	customElements.define("cq-study-parameter", StudyParameter);

	/**
	 * Swatch web component `<cq-swatch>`.
	 *
	 * An interactive color swatch. Relies on the existence of a {@link CIQ.UI.ColorPicker} component.
	 * When a color is selected, setColor(color) will get called for any parent component with that method
	 * @namespace WebComponents.cq-swatch
	 * @example
		 <cq-section>
			 <cq-placeholder>Candle Color
				 <cq-theme-piece cq-piece="cu"><cq-swatch cq-overrides="Hollow"></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="cd"><cq-swatch cq-overrides="Hollow"></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Candle Wick
				 <cq-theme-piece cq-piece="wu"><cq-swatch></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="wd"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Candle Border
				 <cq-theme-piece cq-piece="bu"><cq-swatch cq-overrides="No Border"></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="bd"><cq-swatch cq-overrides="No Border"></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-separator></cq-separator>
			 <cq-placeholder>Line/Bar Chart
				 <cq-theme-piece cq-piece="lc"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-separator></cq-separator>
			 <cq-placeholder>Mountain Color
				 <cq-theme-piece cq-piece="mb"><cq-swatch></cq-swatch></cq-theme-piece>
				 <cq-theme-piece cq-piece="mc"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
		 </cq-section>
	 */

	class Swatch extends HTMLElement {
		constructor() {
			super();
			/**
			 * Optionally set the default color for the swatch.
			 * @type {string}
			 * @memberof WebComponents.cq-swatch
			 */
			this.defaultColor = null;
		}

		connectedCallback() {
			if (this.attached) return;
			this.node = $(this);
			if ($("cq-color-picker").length) {
				this.node.stxtap(
					(function (self) {
						return function (e) {
							self.launchColorPicker();
							e.stopPropagation();
						};
					})(this)
				);
			} else {
				this.style.cursor = "default";
			}
			this.attached = true;
		}

		/**
		 * Attempts to identify the default color for the associated chart. It does so by traversing
		 * up the parent stack and looking for any component that has a context. Or you can set
		 * the default color manually by setting member variable defaultColor;
		 * @memberof WebComponents.cq-swatch
		 */
		getDefaultColor() {
			if (this.defaultColor) return this.defaultColor;
			var context = CIQ.UI.getMyContext(this);
			if (context) return context.stx.defaultColor; // some parent with a context
			return "transparent";
		}

		/**
		 * @alias setColor
		 * @memberof WebComponents.cq-swatch
		 * @since 6.2.0 Colors strip out the opacity so they are the rgb representation
		 */
		setColor(color, percolate) {
			var node = $(this);
			var bgColor = CIQ.getBackgroundColor(this.parentNode);
			var border = CIQ.chooseForegroundColor(bgColor);
			var hslb = CIQ.hsl(bgColor);
			if (!color) color = "transparent";
			var fillColor = color;
			if (color == "auto") {
				fillColor = this.getDefaultColor();
			} else if (color.indexOf("rgba(") === 0) {
				// strip out the alpha component
				fillColor = (fillColor.split(",").slice(0, 3).join(",") + ")").replace(/rgba/, "rgb");
			}
			var hslf = CIQ.hsl(fillColor);
			var isTransparent = CIQ.isTransparent(color);
			node.css({ background: fillColor });
			if (color == "auto" || Math.abs(hslb[2] - hslf[2]) < 0.2 || isTransparent) {
				node.css({ border: "solid " + border + " 1px" });
				if (isTransparent)
					node.css({
						background:
							"linear-gradient(to bottom right, transparent, transparent 49%, " +
							border +
							" 50%, transparent 51%, transparent)",
					});
			} else {
				node.css({ border: "" });
			}

			if (color == "auto") {
				bgColor = CIQ.chooseForegroundColor(fillColor);
				node.css({
					background:
						"linear-gradient(to bottom right, " +
						fillColor +
						", " +
						fillColor +
						" 49%, " +
						bgColor +
						" 50%, " +
						bgColor +
						")",
				});
			}
			if (percolate !== false) CIQ.UI.containerExecute(this, "setColor", color);
		}

		/**
		 * @alias launchColorPicker
		 * @memberof WebComponents.cq-swatch
		 */
		launchColorPicker() {
			var node = $(this);

			var colorPickers = $("cq-color-picker");
			var colorPicker = colorPickers[0];
			colorPicker.callback = (function (self) {
				return function (color) {
					self.setColor(color, null);
				};
			})(this);
			var overrides = this.node.attr("cq-overrides");
			if (overrides) overrides = overrides.split(",");
			colorPicker.display({ node: node, overrides: overrides });
			this.colorPicker = colorPicker;
		}
	}

	CIQ.UI.Swatch = Swatch;
	customElements.define("cq-swatch", Swatch);

	/**
	 * Theme Dialog web component `<cq-theme-dialog>`.
	 *
	 * Manages themes in for chart layout.
	 * @namespace WebComponents.cq-theme-dialog
	 * @example
		 <cq-dialog>
			<cq-theme-dialog>
				<h4 class="title">Create Custom Theme</h4>
				<cq-close></cq-close>
				<cq-scroll cq-no-maximize>
					<cq-section>
					...
					</cq-scroll>
				</cq-theme-dialog>
			</cq-dialog>
	 */
	class ThemeDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}
		/**
		 * Applies changes to all charts on the screen
		 * @memberof WebComponents.cq-theme-dialog
		 * @private
		 */
		applyChanges() {
			var stx = this.context.stx;
			this.helper.update(stx);
			stx.changeOccurred("theme");
		}

		/**
		 * @alias close
		 * @memberof WebComponents.cq-theme-dialog
		 */
		close() {
			this.helper.settings = this.revert;
			this.applyChanges();
			super.close();
		}

		/**
		 * @alias configure
		 * @memberof WebComponents.cq-theme-dialog
		 * @since 6.2.0 basecolor of mountain chart can be configured with "mb" peice
		 */
		open(params) {
			super.open(params);
			var themeName = params.themeName;

			this.initiatingMenu = params.initiatingMenu;
			this.context = params.context;
			this.helper = new CIQ.ThemeHelper({ stx: this.context.stx });
			this.revert = CIQ.clone(this.helper.settings);

			var self = this;
			function configurePiece(name, obj, field, type) {
				var cu = self.node.find('cq-theme-piece[cq-piece="' + name + '"]');
				if (!cu.length) return;
				cu[0].piece = { obj: obj, field: field };
				if (type == "color") {
					cu.find("cq-swatch")[0].setColor(obj[field], false);
				}
			}
			var settings = this.helper.settings;
			configurePiece("cu", settings.chartTypes["Candle/Bar"].up, "color", "color");
			configurePiece("cd", settings.chartTypes["Candle/Bar"].down, "color", "color");
			configurePiece("wu", settings.chartTypes["Candle/Bar"].up, "wick", "color");
			configurePiece("wd", settings.chartTypes["Candle/Bar"].down, "wick", "color");
			configurePiece("bu", settings.chartTypes["Candle/Bar"].up, "border", "color");
			configurePiece("bd", settings.chartTypes["Candle/Bar"].down, "border", "color");
			configurePiece("lc", settings.chartTypes.Line, "color", "color");
			configurePiece("mb", settings.chartTypes.Mountain, "basecolor", "color");
			configurePiece("mc", settings.chartTypes.Mountain, "color", "color");
			configurePiece("bg", settings.chart.Background, "color", "color");
			configurePiece("gl", settings.chart["Grid Lines"], "color", "color");
			configurePiece("dd", settings.chart["Grid Dividers"], "color", "color");
			configurePiece("at", settings.chart["Axis Text"], "color", "color");

			if (!themeName) themeName = "My Theme";
			this.node.find("cq-action input").val(themeName);
		}

		/**
		 * @alias save
		 * @memberof WebComponents.cq-theme-dialog
		 */
		save() {
			var themeName = this.node.find("cq-action input").val();
			var theme = {
				settings: CIQ.clone(this.helper.settings),
				name: themeName,
				builtIn: null,
			};
			CIQ.UI.contextsForEach(function () {
				this.stx.updateListeners("theme");
			});
			var self = this;
			$("cq-themes").each(function () {
				theme.builtIn = this.currentLoadedBuiltIn;
				this.addCustom(theme, self.initiatingMenu);
			});
			super.close();
		}

		/**
		 * @alias setValue
		 * @memberof WebComponents.cq-theme-dialog
		 */
		setValue(obj, field, value) {
			obj[field] = value;
			this.applyChanges();
		}
	}

	CIQ.UI.ThemeDialog = ThemeDialog;
	customElements.define("cq-theme-dialog", ThemeDialog);

	/**
	 * Theme Piece web component `<cq-theme-piece>`.
	 *
	 * Manages themes in for chart layout.
	 * @namespace WebComponents.cq-theme-piece
	 * @example
		 <cq-section>
			 <cq-placeholder>Background
				 <cq-theme-piece cq-piece="bg"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Grid Lines
				 <cq-theme-piece cq-piece="gl"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Date Dividers
				 <cq-theme-piece cq-piece="dd"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
			 <cq-placeholder>Axis Text
				 <cq-theme-piece cq-piece="at"><cq-swatch></cq-swatch></cq-theme-piece>
			 </cq-placeholder>
		 </cq-section>
	 */
	class ThemePiece extends CIQ.UI.BaseComponent {
		constructor() {
			super();
		}

		setBoolean(result) {
			CIQ.UI.containerExecute(this, "setValue", this.piece.obj, this.piece.field, result);
		}

		/**
		 * @alias setColor
		 * @memberof WebComponents.cq-theme-piece
		 */
		setColor(color) {
			if (color == "Hollow" || color == "No Border") {
				color = "transparent";
				this.node.find("cq-swatch")[0].setColor("transparent", false);
			}
			CIQ.UI.containerExecute(this, "setValue", this.piece.obj, this.piece.field, color);
		}
	}

	CIQ.UI.ThemePiece = ThemePiece;
	customElements.define("cq-theme-piece", ThemePiece);

	/**
	 * Themes web component `<cq-themes>`.
	 *
	 * This web component has two functions. The first is displaying available themes in a menu.
	 * The second is providing a theme dialog for entering a new theme.
	 *
	 * Built in themes are merely the names of classes that will be added to the top element of the UIContext when
	 * selected.
	 *
	 * @namespace WebComponents.cq-themes
	 * @example
<cq-themes>
	<cq-themes-builtin cq-no-close>
		<template>
			<cq-item></cq-item>
		</template>
	</cq-themes-builtin>
	<cq-themes-custom cq-no-close>
		<template>
			<cq-theme-custom>
				<cq-item>
					<cq-label></cq-label>
					<cq-close></cq-close>
				</cq-item>
			</cq-theme-custom>
		</template>
	</cq-themes-custom>
	<cq-separator cq-partial></cq-separator>
	<cq-item stxtap="newTheme()"><cq-plus></cq-plus> New Theme </cq-item>
</cq-themes>
	 */
	class Themes extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			this.builtInMenu = $(this).find("cq-themes-builtin");
			this.builtInTemplate = this.builtInMenu.find("template");
			this.customMenu = $(this).find("cq-themes-custom");
			this.customTemplate = this.customMenu.find("template");
		}

		/**
		 * Adds a custom theme
		 * @memberof WebComponents.cq-themes
		 * @param {object} theme The theme descriptor
		 * @param {Themes} initiatingMenu The menu which initially called ThemeDialog. This is used in order to save the new theme as the current theme.
		 */
		addCustom(theme, initiatingMenu) {
			this.params.customThemes[theme.name] = theme;
			if (initiatingMenu === this) this.currentTheme = theme.name;
			this.configureMenu();
			this.persist();
		}

		configureMenu() {
			function loadBuiltIn(self, className) {
				return function (e) {
					self.loadBuiltIn(className);
					if (self.params.callback) {
						self.params.callback({ theme: self.currentTheme });
					}
					self.persist("current");
				};
			}
			function loadCustom(self, themeName) {
				return function (e) {
					self.loadCustom(themeName);
					if (self.params.callback) {
						self.params.callback({ theme: self.currentTheme });
					}
					self.persist("current");
				};
			}
			this.builtInMenu.emptyExceptTemplate();
			this.customMenu.emptyExceptTemplate();
			var display, newMenuItem;
			var builtInThemes = this.params.builtInThemes;
			for (var className in builtInThemes) {
				display = builtInThemes[className];
				newMenuItem = CIQ.UI.makeFromTemplate(this.builtInTemplate);
				newMenuItem.text(display);
				this.makeTap(newMenuItem[0], loadBuiltIn(this, className));
				this.builtInMenu.append(newMenuItem);
			}
			CIQ.I18N.translateUI(null, this.builtInMenu[0]);

			var customThemes = this.params.customThemes;
			for (var themeName in customThemes) {
				display = themeName;
				newMenuItem = CIQ.UI.makeFromTemplate(this.customTemplate);
				newMenuItem.find("cq-label").text(display);
				this.makeTap(newMenuItem.find("cq-item")[0], loadCustom(this, themeName));
				newMenuItem[0].close = (function (self, themeName) {
					return function () {
						self.removeTheme(themeName);
					};
				})(this, themeName);
				this.customMenu.append(newMenuItem);
			}
		}

		/**
		 * Initalize the web componenet
		 * @param {Object} params Parameters
		 * @param {Object} [params.builtInThemes] Object map of built in theme names, display names
		 * @param {Object} [params.defaultTheme] The default built in theme to use
		 * @param {Object} [params.nameValueStore] A {@link CIQ.NameValueStore} object for fetching and saving theme state
		 * @param {string} [params.id] id which can be used to disambiguate when multiple charts are on the screen
		 * @memberof WebComponents.cq-themes
		 * @example
		var UIStorage=new CIQ.NameValueStore();

		var UIThemes=$("cq-themes");
		UIThemes[0].initialize({
			builtInThemes: {"ciq-day":"Day","ciq-night":"Night"},
			defaultTheme: "ciq-night",
			nameValueStore: UIStorage
		});
		 */
		initialize(params) {
			this.params = {};
			if (params) this.params = params;
			if (!this.params.customThemes) this.params.customThemes = {};
			if (!this.params.builtInThemes) this.params.builtInThemes = {};
			if (!this.params.nameValueStore) this.params.nameValueStore = new CIQ.NameValueStore();
			if (params.id) this.id = "themes_" + params.id;

			var self = this;

			if (this.params.nameValueStore) {
				// Retrieve any custom themes the user has created
				this.params.nameValueStore.get("CIQ.Themes.prototype.custom", function (err, result) {
					if (!err && result) {
						self.params.customThemes = result;
					}
					// Set the current theme to the last one selected by user
					self.params.nameValueStore.get(self.id + "CIQ.Themes.prototype.current", function (err, result) {
						if (!err && result && result.theme) {
							self.loadTheme(result.theme);
						} else {
							self.loadTheme(self.params.defaultTheme);
						}
						self.configureMenu();
					});
				});
			} else {
				this.loadTheme(self.params.defaultTheme);
			}
		}

		loadBuiltIn(className) {
			if (this.currentLoadedBuiltIn) {
				$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
			}
			$(this.context.topNode).addClass(className);
			this.currentLoadedBuiltIn = this.currentTheme = className;
			this.reinitializeChart();
		}

		loadCustom(themeName) {
			if (this.currentLoadedBuiltIn) {
				$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
			}
			var theme = this.params.customThemes[themeName];
			if (theme.builtIn) $(this.context.topNode).addClass(theme.builtIn);
			this.currentLoadedBuiltIn = theme.builtIn;
			this.currentTheme = theme.name;
			this.reinitializeChart(theme);
		}

		loadTheme(themeName) {
			if (this.params.customThemes[themeName]) this.loadCustom(themeName);
			else if (this.params.builtInThemes[themeName]) this.loadBuiltIn(themeName);
			else this.loadBuiltIn(this.params.defaultTheme);
		}

		newTheme() {
			var self = this;
			$("cq-theme-dialog").each(function () {
				this.open({ context: self.context, initiatingMenu: self });
			});
		}

		persist(which) {
			if (!this.params.nameValueStore) return;
			if (!which || which == "current")
				this.params.nameValueStore.set(this.id + "CIQ.Themes.prototype.current", { theme: this.currentTheme });
			if (!which || which == "custom")
				this.params.nameValueStore.set("CIQ.Themes.prototype.custom", this.params.customThemes);
		}

		removeTheme(themeName) {
			var saved = false;
			$("cq-themes").each(function () {
				delete this.params.customThemes[themeName];
				this.configureMenu();
				if (!saved) {
					this.persist();
					saved = true;
				}
			});
		}

		/**
		 * @private
		 * @param {object} theme
		 * @memberOf WebComponents.cq-themes
		 */
		reinitializeChart(theme) {
			this.context.stx.setThemeSettings(theme ? theme.settings : null);
		}
	}

	CIQ.UI.Themes = Themes;
	customElements.define("cq-themes", Themes);

	/**
	 * Timezone Dialog web component `<cq-timezone-dialog>`.
	 * @namespace WebComponents.cq-timezone-dialog
	 */
	class TimezoneDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * @memberof WebComponents.cq-timezone-dialog
		 */
		open(params) {
			super.open(params);
			var node = this.node;
			var self = this;
			this.context = params.context;
			var stx = this.context.stx;

			function setTimezone(zone) {
				return function (e) {
					self.close();
					var translatedZone = CIQ.timeZoneMap[zone];
					CIQ.ChartEngine.defaultDisplayTimeZone = translatedZone;
					stx.setTimeZone(stx.dataZone, translatedZone);
					if (stx.chart.symbol) stx.draw();
				};
			}

			var ul = node.find("ul");
			var button = node.find(".ciq-btn");
			if (!this.template) {
				this.template = ul.find("li.timezoneTemplate")[0].cloneNode(true);
			}

			ul.empty();
			for (var key in CIQ.timeZoneMap) {
				var zone = key;
				var display = stx.translateIf(zone);
				var li = this.template.cloneNode(true);
				li.style.display = "block";
				li.innerHTML = display;
				CIQ.safeClickTouch(li, setTimezone(zone));
				ul.append(li);
			}
			var currentUserTimeZone = node.find(".currentUserTimeZone");
			if (stx.displayZone) {
				var fullZone = stx.displayZone;
				for (var tz in CIQ.timeZoneMap) {
					if (CIQ.timeZoneMap[tz] === stx.displayZone) fullZone = tz;
				}
				currentUserTimeZone.text(stx.translateIf("Current TimeZone is") + " " + stx.translateIf(fullZone));
				button.show();
			} else {
				currentUserTimeZone.text(stx.translateIf("Your timezone is your current location"));
				button.hide();
			}
		}

		/**
		 * @memberof WebComponents.cq-timezone-dialog
		 */
		removeTimezone() {
			CIQ.ChartEngine.defaultDisplayTimeZone = null;
			var stx = this.context.stx;
			stx.displayZone = null;
			stx.setTimeZone();

			if (stx.displayInitialized) stx.draw();

			this.close();
		}
	}

	CIQ.UI.TimezoneDialog = TimezoneDialog;
	customElements.define("cq-timezone-dialog", TimezoneDialog);

	/**
	 * Toggle web component `<cq-toggle>`.
	 *
	 * UI Helper that binds a toggle to an object member, or callbacks when toggled
	 * cq-member Object member to observe. If not provided then callbacks will be used exclusively.
	 * cq-action default="class" Action to take
	 * cq-value default="active" Value for action (i.e. class name)
	 * cq-toggles A comma separated list of valid values which will be toggled through with each click. List may include "null".
	 *
	 * use registerCallback to receive a callback every time the toggle changes. When a callback is registered, any automatic
	 * class changes are bypassed
	 *
	 * @namespace WebComponents.cq-toggle
	 * @example
	 * $("cq-toggle").registerCallback(function(value){
	 *    console.log("current value is " + value);
	 *    if(value!=false) this.node.addClass("active");
	 * })
	 */
	class Toggle extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			this.params = {
				member: null,
				obj: null,
				action: "class",
				value: "active",
				toggles: [],
				callbacks: [],
			};
			super.connectedCallback();
		}

		begin() {
			var self = this;
			var stx = this.context.stx;
			if (this.params.member) {
				CIQ.UI.observe({
					selector: this.node,
					obj: this.params.obj,
					member: this.params.member,
					action: "callback",
					value: function (params) {
						self.updateFromBinding(params);
					},
				});
			}
			this.node.stxtap(function () {
				var toggles = self.params.toggles;
				var obj = self.params.obj;
				if (toggles.length > 1) {
					// Cycle through each field in the array with each tap
					for (var i = 0; i < toggles.length; i++) {
						var toggle = toggles[i];
						if (self.currentValue == toggle) {
							if (i < toggles.length - 1) self.set(toggles[i + 1]);
							else self.set(toggles[0]);
							break;
						}
					}
					if (i == toggles.length) {
						// default to first item in toggle
						self.set(toggles[0]);
					}
				} else {
					if (self.currentValue) {
						self.set(false);
					} else {
						self.set(true);
					}
				}
				stx.draw();
				if (obj === stx.layout) stx.changeOccurred("layout");
			});
		}

		registerCallback(fc, immediate) {
			if (immediate !== false) immediate = true;
			this.params.callbacks.push(fc);
			if (immediate) fc.call(this, this.currentValue);
		}

		set(value) {
			if (this.params.member) {
				this.params.obj[this.params.member] = value;
			} else {
				this.currentValue = value;
				for (var i = 0; i < this.params.callbacks.length; i++) {
					this.params.callbacks[i].call(this, this.currentValue);
				}
			}
		}

		setContext(context) {
			this.currentValue |= false; // if it were set to true before, leave it
			this.params.obj = this.context.stx.layout;
			var member = this.node.attr("cq-member");
			if (member) this.params.member = member;
			var action = this.node.attr("cq-action");
			if (action) this.params.action = action;
			var value = this.node.attr("cq-value");
			if (value) this.params.value = value;
			var toggles = this.node.attr("cq-toggles");
			if (toggles) this.params.toggles = toggles.split(",");
			for (var i = 0; i < this.params.toggles.length; i++) {
				if (this.params.toggles[i] == "null") this.params.toggles[i] = null;
			}
			this.begin();
		}

		updateFromBinding(params) {
			this.currentValue = params.obj[params.member];
			if (!this.params.callbacks.length) {
				if (this.params.action == "class") {
					if (this.currentValue) {
						this.node.addClass(this.params.value);
					} else {
						this.node.removeClass(this.params.value);
					}
				}
			} else {
				for (var i = 0; i < this.params.callbacks.length; i++) {
					this.params.callbacks[i].call(this, this.currentValue);
				}
			}

			if (params.member == "crosshair" && this.currentValue === false) this.context.stx.doDisplayCrosshairs();
		}
	}

	CIQ.UI.Toggle = Toggle;
	customElements.define("cq-toggle", Toggle);

	/**
	  * Drawing toolbar web component used to activate and manage available drawings.
	 *
	 * Emits a "change" event when changed
	 *
	 * @namespace WebComponents.cq-toolbar
	 * @example
		<cq-toolbar>
			<cq-menu class="ciq-select">
				<span cq-current-tool>Select Tool</span>
				<cq-menu-dropdown>
					<cq-item stxtap="noTool()">None</cq-item>
					<cq-item stxtap="clearDrawings()">Clear Drawings</cq-item>
					<cq-item stxtap="restoreDefaultConfig(true)">Restore Default Parameters</cq-item>
					<cq-item stxtap="tool('measure')">Measure</cq-item>
					<cq-separator></cq-separator>
					<cq-item stxtap="tool('annotation')">Annotation</cq-item>
					<cq-item stxtap="tool('average')">Average Line</cq-item>
					<cq-item stxtap="tool('callout')">Callout</cq-item>
					<cq-item stxtap="tool('channel')">Channel</cq-item>
					<cq-item stxtap="tool('continuous')">Continuous</cq-item>
					<cq-item stxtap="tool('crossline')">Crossline</cq-item>
					<cq-item stxtap="tool('freeform')">Doodle</cq-item>
					<cq-item stxtap="tool('ellipse')">Ellipse</cq-item>
					<cq-item stxtap="tool('retracement')">Fib Retracement</cq-item>
					<cq-item stxtap="tool('fibprojection')">Fib Projection</cq-item>
					<cq-item stxtap="tool('fibarc')">Fib Arc</cq-item>
					<cq-item stxtap="tool('fibfan')">Fib Fan</cq-item>
					<cq-item stxtap="tool('fibtimezone')">Fib Time Zone</cq-item>
					<cq-item stxtap="tool('gannfan')">Gann Fan</cq-item>
					<cq-item stxtap="tool('gartley')">Gartley</cq-item>
					<cq-item stxtap="tool('horizontal')">Horizontal</cq-item>
					<cq-item stxtap="tool('line')">Line</cq-item>
					<cq-item stxtap="tool('pitchfork')">Pitchfork</cq-item>
					<cq-item stxtap="tool('quadrant')">Quadrant Lines</cq-item>
					<cq-item stxtap="tool('ray')">Ray</cq-item>
					<cq-item stxtap="tool('rectangle')">Rectangle</cq-item>
					<cq-item stxtap="tool('regression')">Regression Line</cq-item>
					<cq-item stxtap="tool('segment')">Segment</cq-item>
					<cq-item stxtap="tool('arrow')">Shape - Arrow</cq-item>
					<cq-item stxtap="tool('check')">Shape - Check</cq-item>
					<cq-item stxtap="tool('xcross')">Shape - Cross</cq-item>
					<cq-item stxtap="tool('focusarrow')">Shape - Focus</cq-item>
					<cq-item stxtap="tool('heart')">Shape - Heart</cq-item>
					<cq-item stxtap="tool('star')">Shape - Star</cq-item>
					<cq-item stxtap="tool('speedarc')">Speed Resistance Arc</cq-item>
					<cq-item stxtap="tool('speedline')">Speed Resistance Line</cq-item>
					<cq-item stxtap="tool('timecycle')">Time Cycle</cq-item>
					<cq-item stxtap="tool('tirone')">Tirone Levels</cq-item>
					<cq-item stxtap="tool('trendline')">Trend Line</cq-item>
					<cq-item stxtap="tool('vertical')">Vertical</cq-item>
				</cq-menu-dropdown>
			</cq-menu>
			<cq-toolbar-settings>
				<cq-fill-color cq-section class="ciq-color" stxbind="getFillColor()" stxtap="pickFillColor()">
					<span></span>
				</cq-fill-color>
				<div>
					<cq-line-color cq-section cq-overrides="auto" class="ciq-color" stxbind="getLineColor()" stxtap="pickLineColor()"><span></span></cq-line-color>
					<cq-line-style cq-section>
						<cq-menu class="ciq-select">
							<span cq-line-style class="ciq-line ciq-selected"></span>
							<cq-menu-dropdown class="ciq-line-style-menu">
								<cq-item stxtap="setLine(1,'solid')"><span class="ciq-line-style-option ciq-solid-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'solid')"><span class="ciq-line-style-option ciq-solid-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'solid')"><span class="ciq-line-style-option ciq-solid-5"></span></cq-item>
								<cq-item stxtap="setLine(1,'dotted')"><span class="ciq-line-style-option ciq-dotted-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'dotted')"><span class="ciq-line-style-option ciq-dotted-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'dotted')"><span class="ciq-line-style-option ciq-dotted-5"></span></cq-item>
								<cq-item stxtap="setLine(1,'dashed')"><span class="ciq-line-style-option ciq-dashed-1"></span></cq-item>
								<cq-item stxtap="setLine(3,'dashed')"><span class="ciq-line-style-option ciq-dashed-3"></span></cq-item>
								<cq-item stxtap="setLine(5,'dashed')"><span class="ciq-line-style-option ciq-dashed-5"></span></cq-item>
								<cq-item stxtap="setLine(0,'none')" class="ciq-none">None</cq-item>
							</cq-menu-dropdown>
						</cq-menu>
					</cq-line-style>
				</div>
				<cq-axis-label cq-section>
					<div class="ciq-heading">Axis Label:</div>
					<span stxtap="toggleAxisLabel()" class="ciq-checkbox ciq-active"><span></span></span>
				</cq-axis-label>
				<cq-annotation cq-section>
					<cq-annotation-italic stxtap="toggleFontStyle('italic')" class="ciq-btn" style="font-style:italic;">I</cq-annotation-italic>
					<cq-annotation-bold stxtap="toggleFontStyle('bold')" class="ciq-btn" style="font-weight:bold;">B</cq-annotation-bold>
					<cq-menu class="ciq-select">
						<span cq-font-size>12px</span>
						<cq-menu-dropdown class="ciq-font-size">
							<cq-item stxtap="setFontSize('8px')">8</cq-item>
							<cq-item stxtap="setFontSize('10px')">10</cq-item>
							<cq-item stxtap="setFontSize('12px')">12</cq-item>
							<cq-item stxtap="setFontSize('13px')">13</cq-item>
							<cq-item stxtap="setFontSize('14px')">14</cq-item>
							<cq-item stxtap="setFontSize('16px')">16</cq-item>
							<cq-item stxtap="setFontSize('20px')">20</cq-item>
							<cq-item stxtap="setFontSize('28px')">28</cq-item>
							<cq-item stxtap="setFontSize('36px')">36</cq-item>
							<cq-item stxtap="setFontSize('48px')">48</cq-item>
							<cq-item stxtap="setFontSize('64px')">64</cq-item>
						</cq-menu-dropdown>
					</cq-menu>
					<cq-menu class="ciq-select">
						<span cq-font-family>Default</span>
						<cq-menu-dropdown class="ciq-font-family">
							<cq-item stxtap="setFontFamily('Default')">Default</cq-item>
							<cq-item stxtap="setFontFamily('Helvetica')">Helvetica</cq-item>
							<cq-item stxtap="setFontFamily('Courier')">Courier</cq-item>
							<cq-item stxtap="setFontFamily('Garamond')">Garamond</cq-item>
							<cq-item stxtap="setFontFamily('Palatino')">Palatino</cq-item>
							<cq-item stxtap="setFontFamily('Times New Roman')">Times New Roman</cq-item>
						</cq-menu-dropdown>
					</cq-menu>
				</cq-annotation>
				<cq-clickable cq-fib-settings cq-selector="cq-fib-settings-dialog" cq-method="open" cq-section><span class="ciq-btn">Settings</span></cq-clickable>
				<div cq-toolbar-action="save" stxtap="saveConfig()" cq-section><div cq-toolbar-dirty></div><cq-tooltip>Save Config</cq-tooltip></div>
				<div cq-toolbar-action="restore" stxtap="restoreDefaultConfig()" cq-section><cq-tooltip>Restore Config</cq-tooltip></div>
			</cq-toolbar-settings>
			<cq-measure><span class="mMeasure"></span></cq-measure>
			<cq-undo-section>
				<cq-undo class="ciq-btn">Undo</cq-undo>
				<cq-redo class="ciq-btn">Redo</cq-redo>
			</cq-undo-section>
		</cq-toolbar>
	 */
	class DrawingToolbar extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			this.node = $(this);
			this.params = {
				toolSelection: this.node.find("*[cq-current-tool]"),
				lineSelection: this.node.find("*[cq-line-style]"),
				fontSizeSelection: this.node.find("*[cq-font-size]"),
				fontFamilySelection: this.node.find("*[cq-font-family]"),
				fontStyleToggle: this.node.find("cq-annotation-italic"),
				fontWeightToggle: this.node.find("cq-annotation-bold"),
				axisLabelToggle: this.node.find("cq-axis-label .ciq-checkbox"),
				fillColor: this.node.find("cq-fill-color").not("cq-cvp-controller"),
				lineColor: this.node.find("cq-line-color").not("cq-cvp-controller"),
				cvpControllers: this.node.find("cq-cvp-controller"),
			};
			this.params.cvpControllers.prop("toolbar", this);
			this.noToolSelectedText = "";
		}

		clearDrawings() {
			this.context.stx.clearDrawings(null, false);
		}

		crosshairs(activator) {
			var stx = this.context.stx;
			$(this.params.toolSelection).html($(activator.node).html());
			stx.changeVectorType(null);
			stx.layout.crosshair = true;
			stx.doDisplayCrosshairs();
			stx.findHighlights(false, true);
			stx.changeOccurred("layout");
			stx.draw();
			stx.updateChartAccessories();
			this.node.find("*[cq-section]").removeClass("ciq-active");
			this.emit();
		}

		defaultElements(drawingParameters) {
			var arr = [];
			for (var param in drawingParameters) {
				if (param == "color") arr.push("cq-line-color");
				else if (param == "fillColor") arr.push("cq-fill-color");
				else if (param == "pattern" || param == "lineWidth") arr.push("cq-line-style");
				else if (param == "axisLabel") arr.push("cq-axis-label");
				else if (param == "font") arr.push("cq-annotation");
				else if (param == "parameters") arr.push("cq-clickable");
			}

			return arr;
		}

		emit() {
			// This is old style to support IE11
			var event = document.createEvent("Event");
			event.initEvent("change", true, true);
			this.node.find("*[cq-toolbar-dirty]").addClass("ciq-active");
			this.dispatchEvent(event);
		}

		getFillColor(activator) {
			var node = $(activator.node);
			var color = this.context.stx.currentVectorParameters.fillColor;
			if (color == "transparent" || color == "auto") color = "";
			node.css({ background: color });
			var bgColor = CIQ.getBackgroundColor(this.parentNode);
			if (color && Math.abs(CIQ.hsl(bgColor)[2] - CIQ.hsl(color)[2]) < 0.2) {
				var border = CIQ.chooseForegroundColor(bgColor);
				node.css({ border: "solid " + border + " 1px" });
			} else {
				node.css({ border: "" });
			}
		}

		getLineColor(activator) {
			var node = $(activator.node);
			var color = this.context.stx.currentVectorParameters.currentColor;
			if (color == "transparent" || color == "auto") color = "";
			node.css({ background: color });
			var bgColor = CIQ.getBackgroundColor(this.parentNode);
			if (!color || Math.abs(CIQ.hsl(bgColor)[2] - CIQ.hsl(color)[2]) < 0.2) {
				var border = CIQ.chooseForegroundColor(bgColor);
				node.css({ border: "solid " + border + " 1px" });
				if (!color)
					node.css({
						background:
							"linear-gradient(to bottom right, " +
							border +
							", " +
							border +
							" 49%, " +
							bgColor +
							" 50%, " +
							bgColor +
							")",
					});
			} else {
				node.css({ border: "" });
			}
		}

		noTool() {
			var stx = this.context.stx;
			stx.changeVectorType(null);
			if (stx.layout.crosshair) {
				stx.layout.crosshair = false;
				stx.changeOccurred("layout");
				stx.doDisplayCrosshairs();
			}
			if (stx.preferences.magnet) {
				this.toggleMagnet(this);
			}
			$(this.params.toolSelection).text(this.noToolSelectedText);
			$(this.params.toolSelection).attr("cq-current-tool", "");
			this.node.find("*[cq-section]").removeClass("ciq-active");
			this.emit();
		}

		pickFillColor(activator) {
			var node = activator.node;
			var colorPickers = $("cq-color-picker");
			if (!colorPickers.length) {
				console.log("DrawingToolbar.prototype.pickFillColor: no ColorPicker available");
				return;
			}
			var colorPicker = colorPickers[0];
			var self = this;
			colorPicker.callback = function (color) {
				self.context.stx.currentVectorParameters.fillColor = color;
				self.getFillColor({ node: node });
				self.emit();
			};
			colorPicker.display({ node: node });
		}

		pickLineColor(activator) {
			var node = activator.node;
			var colorPickers = $("cq-color-picker");
			if (!colorPickers.length) {
				console.log("DrawingToolbar.prototype.pickLineColor: no ColorPicker available");
				return;
			}
			var colorPicker = colorPickers[0];
			var self = this;
			colorPicker.callback = function (color) {
				self.context.stx.currentVectorParameters.currentColor = color;
				self.getLineColor({ node: node });
				self.emit();
			};
			var overrides = $(node).attr("cq-overrides");
			if (overrides) overrides = overrides.split(",");
			colorPicker.display({ node: node, overrides: overrides });
		}

		restoreDefaultConfig(activator, all) {
			var stx = this.context.stx;
			CIQ.Drawing.restoreDefaultConfig(stx, stx.currentVectorParameters.vectorType, all);
			this.node.find("*[cq-toolbar-action='restore']").removeClass("ciq-active");
			this.sync();
		}

		saveConfig() {
			var stx = this.context.stx;
			CIQ.Drawing.saveConfig(stx, stx.currentVectorParameters.vectorType);
			this.node.find("*[cq-toolbar-action='restore']").addClass("ciq-active");
			this.sync();
		}

		setFibs(width, pattern) {
			var fib = this.context.stx.currentVectorParameters.fibonacci;
			if (fib) {
				for (var i = 0; i < fib.fibs.length; i++) {
					fib.fibs[i].parameters.lineWidth = width;
					fib.fibs[i].parameters.pattern = pattern;
				}
				fib.timezone.parameters.lineWidth = width;
				fib.timezone.parameters.pattern = pattern;
			}
		}

		setFontFamily(activator, fontFamily) {
			var stx = this.context.stx;

			if (fontFamily == "Default") {
				stx.currentVectorParameters.annotation.font.family = null;
			} else {
				stx.currentVectorParameters.annotation.font.family = fontFamily;
			}
			$(this.params.fontFamilySelection).text(fontFamily);
			this.emit();
		}

		setFontSize(activator, fontSize) {
			var stx = this.context.stx;

			stx.currentVectorParameters.annotation.font.size = fontSize;
			$(this.params.fontSizeSelection).text(fontSize);
			this.emit();
		}

		setContext(context) {
			this.noToolSelectedText = $(this.params.toolSelection).text();
			this.sync();
			var self = this;
			context.stx.addEventListener("theme", function (obj) {
				self.sync();
			});
		}

		setLine(activator, width, pattern) {
			var stx = this.context.stx;

			stx.currentVectorParameters.lineWidth = width;
			stx.currentVectorParameters.pattern = pattern;
			this.setFibs(width, pattern);
			if (this.currentLineSelectedClass) $(this.params.lineSelection).removeClass(this.currentLineSelectedClass);
			this.currentLineSelectedClass = "ciq-" + pattern + "-" + parseInt(width, 10);
			if (pattern == "none") {
				this.currentLineSelectedClass = null;
			} else {
				$(this.params.lineSelection).addClass(this.currentLineSelectedClass);
			}
			this.emit();
		}

		/**
		 * Synchronizes the drawing toolbar with stx.currentVectorParameters. Poor man's data binding.
		 * @param {Object} [cvp=stx.currentVectorParameters] A new drawing object, otherwise defaults to the current one
		 * @memberof WebComponents.cq-toolbar
		 */
		sync(cvp) {
			var stx = this.context.stx;
			if (!cvp) cvp = stx.currentVectorParameters;
			else stx.currentVectorParameters = CIQ.extend(stx.currentVectorParameters || {}, cvp);

			this.setLine(null, cvp.lineWidth, cvp.pattern);

			var style = stx.canvasStyle("stx_annotation");

			var initialSize = cvp.annotation.font.size || style.fontSize;
			this.setFontSize(null, initialSize);

			var initialFamily = cvp.annotation.font.family || style.fontFamily;
			this.setFontFamily(null, initialFamily);

			var initialFontStyle = cvp.annotation.font.style || style.fontStyle;
			$(this.params.fontStyleToggle)[initialFontStyle === "italic" ? "addClass" : "removeClass"]("ciq-active");

			var initialWeight = cvp.annotation.font.weight || style.fontWeight;
			$(this.params.fontWeightToggle)[initialWeight === "bold" || initialWeight >= 700 ? "addClass" : "removeClass"](
				"ciq-active"
			);

			$(this.params.axisLabelToggle)[cvp.axisLabel ? "addClass" : "removeClass"]("ciq-active");

			this.getFillColor({ node: $(this.params.fillColor) });
			this.getLineColor({ node: $(this.params.lineColor) });

			$(this.params.cvpControllers).each(function () {
				this.sync(cvp);
			});

			this.node.find("*[cq-toolbar-dirty]").removeClass("ciq-active");
		}

		toggleAxisLabel(activator) {
			var stx = this.context.stx;

			if (stx.currentVectorParameters.axisLabel === true) {
				stx.currentVectorParameters.axisLabel = false;
				$(activator.node).removeClass("ciq-active");
			} else {
				stx.currentVectorParameters.axisLabel = true;
				$(activator.node).addClass("ciq-active");
			}
			this.emit();
		}

		toggleFontStyle(activator, fontStyle) {
			var stx = this.context.stx;

			if (fontStyle == "italic") {
				if (stx.currentVectorParameters.annotation.font.style == "italic") {
					stx.currentVectorParameters.annotation.font.style = null;
					$(activator.node).removeClass("ciq-active");
				} else {
					stx.currentVectorParameters.annotation.font.style = "italic";
					$(activator.node).addClass("ciq-active");
				}
			} else if (fontStyle == "bold") {
				if (stx.currentVectorParameters.annotation.font.weight == "bold") {
					stx.currentVectorParameters.annotation.font.weight = null;
					$(activator.node).removeClass("ciq-active");
				} else {
					stx.currentVectorParameters.annotation.font.weight = "bold";
					$(activator.node).addClass("ciq-active");
				}
			}
			this.emit();
		}

		toggleMagnet(activator) {
			var toggle = $(activator.node); //.find("cq-toggle");
			var stx = this.context.stx;
			if (stx.preferences.magnet) {
				toggle.removeClass("active");
				stx.preferences.magnet = false;
			} else {
				toggle.addClass("active");
				stx.preferences.magnet = true;
			}
			CIQ.clearCanvas(stx.chart.tempCanvas, stx);
		}

		tool(activator, toolName) {
			if (!toolName) toolName = activator.node.getAttribute("cq-tool");
			if (!toolName) return;
			var stx = this.context.stx;
			stx.clearMeasure();
			stx.changeVectorType(toolName);
			$(this.params.toolSelection).html($(activator.node).html());
			$(this.params.toolSelection).attr("cq-current-tool", toolName);

			this.node.find("*[cq-section]").removeClass("ciq-active");
			var drawingParameters = CIQ.Drawing.getDrawingParameters(stx, toolName);
			if (drawingParameters) {
				this.node.find("*[cq-toolbar-action='save']").addClass("ciq-active");
				var drawingPrefs = stx.preferences.drawings;
				if (drawingPrefs && drawingPrefs[toolName])
					this.node.find("*[cq-toolbar-action='restore']").addClass("ciq-active");
				// fibtimezone has no values to display in the settings dialog
				if (toolName === "fibtimezone") {
					delete drawingParameters.parameters;
				}

				var none = $(this.params.lineSelection).parent().find(".ciq-none");
				none.hide();
				var elements = this.defaultElements(drawingParameters);
				for (var i = 0; i < elements.length; i++) {
					$(this.node).find(elements[i]).addClass("ciq-active");
					if (elements[i] == "cq-fill-color") none.show();
				}
				elements = CIQ.Drawing[toolName].prototype.$controls;
				for (i = 0; elements && i < elements.length; i++) {
					$(this.node).find(elements[i]).addClass("ciq-active");
				}
			}
			this.sync();
		}
	}

	CIQ.UI.DrawingToolbar = DrawingToolbar;
	customElements.define("cq-toolbar", DrawingToolbar);

	/**
	 * Undo web component `<cq-undo>`.
	 *
	 * @namespace WebComponents.cq-undo
	 * @example
	 <cq-undo-section>
		 <cq-undo class="ciq-btn">Undo</cq-undo>
		 <cq-redo class="ciq-btn">Redo</cq-redo>
	 </cq-undo-section>
	 */
	class Undo extends CIQ.UI.ContextTag {
		constructor() {
			super();
			this.redoButton = null;
			this.undostack = [];
			this.redostack = [];
			this.contexts = [];
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();
			var self = this;
			$(this).stxtap(function () {
				self.undo();
			});
		}

		/**
		 * Clears the stack of all redo or undo operations for the context
		 * @param  {CIQ.UI.Context} context The context to clear
		 * @alias clear
		 * @memberof WebComponents.cq-undo
		 */
		clear(context) {
			this.setButtonStyle();
		}

		handleEvent(context, type, data) {
			this.undostack.push({ context: context, drawings: data.before });
			this.redostack = [];
			this.setButtonStyle();
		}

		keyStroke(hub, key, e, keystroke) {
			if (key == "z" && (keystroke.ctrl || keystroke.cmd)) {
				// ctrl-z
				if (keystroke.shift) {
					this.redo();
				} else {
					this.undo();
				}
				return true;
			}
			if (key == "y" && (keystroke.ctrl || keystroke.cmd)) {
				// ctrl-y
				this.redo();
				return true;
			}
		}

		manageContext(context) {
			this.addClaim(this);
			var self = this;
			context.stx.addEventListener("undoStamp", function (data) {
				self.handleEvent(context, "undoStamp", data);
			});
			this.contexts.push(context);
		}

		/**
		 * Reverts latest undone drawing.
		 * @alias redo
		 * @memberof WebComponents.cq-undo
		 */
		redo() {
			var state = this.redostack.pop();
			if (state) {
				var context = state.context;
				this.undostack.push({
					context: context,
					drawings: context.stx.exportDrawings(),
				});
				var drawings = state.drawings;
				context.stx.abortDrawings(true);
				context.stx.importDrawings(drawings);
				context.stx.changeOccurred("vector");
				context.stx.draw();
			}
			this.setButtonStyle();
		}

		/**
		 * @private
		 */
		setButtonStyle() {
			if (this.undostack.length) {
				$(this).attr("cq-active", "true");
			} else {
				$(this).removeAttr("cq-active");
			}
			if (this.redoButton) {
				if (this.redostack.length) {
					$(this.redoButton).attr("cq-active", "true");
				} else {
					$(this.redoButton).removeAttr("cq-active");
				}
			}
		}

		setContext(context) {
			this.manageContext(this.context);

			var self = this;
			this.addInjection("append", "initializeChart", function () {
				self.undostack = [];
				self.redostack = [];
				self.clear();
			});
		}

		/**
		 * Reverts last drawing made.
		 * @alias undo
		 * @memberof WebComponents.cq-undo
		 */
		undo() {
			// If a drawing tool is in action, then pressing undo will kill the current tool
			var foundOne = false;
			for (var i = 0; i < this.contexts.length; i++) {
				if (this.contexts[i].stx.activeDrawing) {
					this.contexts[i].stx.undo();
					foundOne = true;
				}
			}
			if (foundOne) return;

			// otherwise proceed to popping off the stack
			var state = this.undostack.pop();
			if (state) {
				var context = state.context;
				this.redostack.push({
					context: context,
					drawings: context.stx.exportDrawings(),
				});
				var drawings = state.drawings;
				context.stx.abortDrawings(true);
				context.stx.importDrawings(drawings);
				context.stx.changeOccurred("vector");
				context.stx.draw();
			}
			this.setButtonStyle();
		}
	}

	CIQ.UI.Undo = Undo;
	customElements.define("cq-undo", Undo);

	/**
	 * View Dialog web component `<cq-view-dialog>`.
	 *
	 * See {@link CIQ.UI.ViewsMenu} for more details on menu management for this component
	 * @namespace WebComponents.cq-view-dialog
	 * @example
		 <cq-dialog>
				 <cq-view-dialog>
					<h4>Save View</h4>
					<div stxtap="close()" class="ciq-icon ciq-close"></div>
					<div style="text-align:center;margin-top:10px;">
						<i>Enter name of view:</i>
						<p>
							<input spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" maxlength="40" placeholder="Name"><br>
						</p>
						<span class="ciq-btn" stxtap="save()">Save</span>
				</div>
			</cq-view-dialog>
		 </cq-dialog>
	 */
	class ViewDialog extends CIQ.UI.DialogContentTag {
		constructor() {
			super();
		}

		/**
		 * Saves the new view. This updates all cq-view menus on the screen, and persists the view in the nameValueStore.
		 * @alias save
		 * @memberof WebComponents.cq-view-dialog
		 */
		save() {
			var viewName = this.node.find("input").val();
			if (!viewName) return;

			var self = this;
			var madeChange = false;
			var layout = this.context.stx.exportLayout();
			$("cq-views").each(function () {
				var obj = this.params.viewObj;
				var view;

				for (var i = 0; i < obj.views.length; i++) {
					view = obj.views[i];
					if (viewName == CIQ.first(view)) break;
				}
				if (i == obj.views.length) {
					view = {};
					view[viewName] = {};
					obj.views.push(view);
				}
				view[viewName] = layout;
				delete view[viewName].candleWidth;
				this.renderMenu();
				//this.context.stx.updateListeners("layout");
				if (!madeChange) {
					// We might have a cq-view menu on multiple charts on the screen. Only persist once.
					madeChange = true;
					this.params.nameValueStore.set("stx-views", obj.views);
				}
			});
			this.close();
		}
	}

	CIQ.UI.ViewDialog = ViewDialog;
	customElements.define("cq-view-dialog", ViewDialog);

	/**
	 * Views web component `<cq-views>`.
	 *
	 * This web component has two functions. The first is displaying available views in a menu.
	 * The second is providing a views dialog for entering a new view.
	 *
	 * @namespace WebComponents.cq-views
	 * @example
			<cq-menu class="ciq-menu ciq-views collapse">
				<span>Views</span>
				<cq-menu-dropdown>
					<cq-views>
						<cq-heading>Saved Views</cq-heading>
						<cq-views-content>
							<template cq-view>
								<cq-item>
									<cq-label></cq-label>
									<div class="ciq-icon ciq-close"></div>
								</cq-item>
							</template>
						</cq-views-content>
						<cq-separator cq-partial></cq-separator>
						<cq-view-save>
							<cq-item><cq-plus></cq-plus>Save View</cq-item>
						</cq-view-save>
					</cq-views>
				</cq-menu-dropdown>
			</cq-menu>
	 */
	class Views extends CIQ.UI.ContextTag {
		constructor() {
			super();
		}

		/**
		 * Initialize a views menu
		 *
		 * @param {Object} [params] Parameters to control behavior of the menu
		 * @param {Object} [params.viewObj={views:[]}] Specify the object which contains the "views" objects.  If omitted, will create one.
		 * @param {CIQ.NameValueStore} [params.nameValueStore=CIQ.NameValueStore] Specify the storage class.  If omitted, will use  {@link CIQ.NameValueStore}. See example for storage class function signatures and CB requirements.
		 * @param {Object} [params.renderCB=null] callback executed on menu after rendering.  Takes the menu as argument.
		 * @param {Object} [params.cb] Get a callback when the nameValueStore has retrieved the data.
		 * @memberof WebComponents.cq-views
		 * @example
		 * 	//
			// To have the views web component menus use a different storage function,
			// just add it to the 'parameters.nameValueStore' like so:

			$("cq-views").each(function(){
				this.initialize({nameValueStore: new MyNameValueStore()});
			});

			//And make sure you create your own MyNameValueStore functions in the following format:

			 MyNameValueStore=function(){
			 };

			 MyNameValueStore.prototype.set=function(field, value, cb){
			   // Add code here to send the view object ('value') to your repository and store under a key of 'field'
			  if(cb) cb(errorCode);
			 };

			 MyNameValueStore.prototype.get=function(field, cb){
			  // Add code here to get the views object for key 'field' from your repository and rerun it in the callback.
			  if(cb) cb(errorCode, yourViewObject);
			 };

			 MyNameValueStore.prototype.remove=function(field, cb){
			  // Add code here to remove the view object under the key 'field' from your repository
			  if(cb) cb(errorCode);
			 };
		 *
		 * @since 3.0.7 params.cb added to signature.
		 * @since 4.1.0 ViewMenu helper has been deprecated. Please call $("cq-views")[0].initialize() now.
		 *
		 */
		initialize(params) {
			this.params = params ? params : {};
			if (!this.params.viewObj) this.params.viewObj = { views: [] };
			if (!this.params.nameValueStore) this.params.nameValueStore = new CIQ.NameValueStore();
			if (!this.params.template) this.params.template = "template[cq-view]";
			this.params.template = this.node.find(this.params.template);
			this.params.template.detach();
			var self = this;
			this.params.nameValueStore.get("stx-views", function (err, obj) {
				if (!err && obj) self.params.viewObj.views = obj;
				if (self.params.cb) self.params.cb.call(self);
				self.renderMenu();
			});
		}

		/**
		 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
		 * CIQ.UI.ViewsMenu for processing stxtap attributes, or you can call renderMenu() to automatically
		 * generate the menu.
		 * @memberof WebComponents.cq-views
		 */
		renderMenu() {
			var menu = $(this.node);
			var self = this;
			var stx = self.context.stx;

			function remove(i) {
				return function (e) {
					e.stopPropagation();
					var saved = false;
					$("cq-views").each(function () {
						this.params.viewObj.views.splice(i, 1);
						if (!saved) {
							this.params.nameValueStore.set("stx-views", self.params.viewObj.views);
							saved = true;
						}
						this.renderMenu();
					});
				};
			}

			function enable(i) {
				return function (e) {
					e.stopPropagation();
					self.uiManager.closeMenu();
					if (self.context.loader) self.context.loader.show();
					var layout = CIQ.first(self.params.viewObj.views[i]);
					function importLayout() {
						var finishImportLayout = function () {
							stx.changeOccurred("layout");
							if (self.context.loader) self.context.loader.hide();
						};
						stx.importLayout(self.params.viewObj.views[i][layout], {
							managePeriodicity: true,
							preserveTicksAndCandleWidth: true,
							cb: finishImportLayout,
						});
					}
					setTimeout(importLayout, 10);
				};
			}

			menu.find("cq-views-content cq-item").remove();
			for (var v = 0; v < this.params.viewObj.views.length; v++) {
				var view = CIQ.first(self.params.viewObj.views[v]);
				if (view == "recent") continue;
				var item = CIQ.UI.makeFromTemplate(this.params.template);
				var label = item.find("cq-label");
				var removeView = item.find("div");

				if (label.length) {
					label.addClass("view-name-" + view);
					label.prepend(view); //don't use text(); it wipes out anything else embedded in the item
				}
				if (removeView.length) removeView.stxtap(remove(v));
				this.makeTap(item[0], enable(v));
				menu.find("cq-views-content").append(item);
			}

			var addNew = menu.find("cq-view-save");
			if (addNew) {
				var context = this.context;
				this.makeTap(addNew.find("cq-item")[0], function (e) {
					$("cq-view-dialog").each(function () {
						$(this).find("input").val("");
						this.open({ context: context });
					});
				});
			}
			if (this.params.renderCB) this.params.renderCB(menu);
		}
	}

	CIQ.UI.Views = Views;
	customElements.define("cq-views", Views);

	/**
	 * Color Picker web component `<cq-color-picker>`.
	 *
	 * cq-colors attribute can contain a csv list of CSS colors to use
	 * or this.params.colorMap can be set to a two dimensional array of colors
	 * @namespace WebComponents.cq-color-picker
	 * @example
		 <cq-color-picker>
			 <cq-colors></cq-colors>
			 <cq-overrides>
				 <template>
					 <div class="ciq-btn"></div>
				 </template>
			 </cq-overrides>
		 </cq-color-picker>
	 */
	class ColorPicker extends CIQ.UI.Dialog {
		constructor() {
			super();
			this.params = {
				colorMap: [
					[
						"#ffffff",
						"#e1e1e1",
						"#cccccc",
						"#b7b7b7",
						"#a0a0a5",
						"#898989",
						"#707070",
						"#626262",
						"#555555",
						"#464646",
						"#363636",
						"#262626",
						"#1d1d1d",
						"#000000",
					],
					[
						"#f4977c",
						"#f7ac84",
						"#fbc58d",
						"#fff69e",
						"#c4de9e",
						"#85c99e",
						"#7fcdc7",
						"#75d0f4",
						"#81a8d7",
						"#8594c8",
						"#8983bc",
						"#a187bd",
						"#bb8dbe",
						"#f29bc1",
					],
					[
						"#ef6c53",
						"#f38d5b",
						"#f8ae63",
						"#fff371",
						"#acd277",
						"#43b77a",
						"#2ebbb3",
						"#00bff0",
						"#4a8dc8",
						"#5875b7",
						"#625da6",
						"#8561a7",
						"#a665a7",
						"#ee6fa9",
					],
					[
						"#ea1d2c",
						"#ee652e",
						"#f4932f",
						"#fff126",
						"#8ec648",
						"#00a553",
						"#00a99c",
						"#00afed",
						"#0073ba",
						"#0056a4",
						"#323390",
						"#66308f",
						"#912a8e",
						"#e9088c",
					],
					[
						"#9b0b16",
						"#9e4117",
						"#a16118",
						"#c6b920",
						"#5a852d",
						"#007238",
						"#00746a",
						"#0077a1",
						"#004c7f",
						"#003570",
						"#1d1762",
						"#441261",
						"#62095f",
						"#9c005d",
					],
					[
						"#770001",
						"#792e03",
						"#7b4906",
						"#817a0b",
						"#41661e",
						"#005827",
						"#005951",
						"#003b5c",
						"#001d40",
						"#000e35",
						"#04002c",
						"#19002b",
						"#2c002a",
						"#580028",
					],
				],
			};
		}

		connectedCallback() {
			if (this.attached) return;
			super.connectedCallback();

			var node = $(this);
			var colors = node.attr("cq-colors");
			if (colors) {
				// Convert a csv list of colors to a two dimensional array
				colors = colors.split(",");
				var cols = Math.ceil(Math.sqrt(colors.length));
				this.params.colorMap = [];
				var col = 0;
				var row = [];
				for (var i = 0; i < colors.length; i++) {
					if (col >= cols) {
						col = 0;
						this.params.colorMap.push(row);
						row = [];
					}
					row.push(colors[i]);
					col++;
				}
				this.params.colorMap.push(row);
			}
			this.cqOverrides = node.find("cq-overrides");
			this.template = this.cqOverrides.find("template");
			this.initialize();
		}

		/**
		 * Displays the color picker in proximity to the node passed in
		 * @param  {object} activator The object representing what caused picker to display
		 * @param  {HTMLElement} [activator.node] The node near where to display the color picker
		 * @param {Array} [activator.overrides] Array of overrides. For each of these, a button will be created that if pressed
		 * will pass that override back instead of the color
		 * @alias display
		 * @memberof WebComponents.cq-color-picker
		 */
		display(activator) {
			var node = $(activator.node);

			// Algorithm to place the color picker to the right of whichever node was just pressed
			var positionOfNode = node[0].getBoundingClientRect();
			this.picker.css({ top: "0px", left: "0px" });
			var positionOfColorPicker = this.parentNode.getBoundingClientRect();
			var x = positionOfNode.left - positionOfColorPicker.left + node.width() + 10;
			var y = positionOfNode.top - positionOfColorPicker.top + 5;

			// ensure color picker doesn't go off right edge of screen
			var docWidth = $(document).width();
			var w = this.picker.width();
			if (x + w > docWidth) x = docWidth - w - 20; // 20 for a little whitespace and padding

			// or bottom of screen
			var docHeight = $(document).height();
			var h = this.picker.height();
			if (y + h > docHeight) y = docHeight - h - 20; // 20 for a little whitespace and padding

			this.picker.css({ left: x + "px", top: y + "px" });
			this.cqOverrides.emptyExceptTemplate();
			var context = this.context || CIQ.UI.getMyContext(this);

			if (activator.overrides && this.template.length) {
				for (var i = 0; i < activator.overrides.length; i++) {
					var override = activator.overrides[i];
					var n = CIQ.UI.makeFromTemplate(this.template, true);
					if (context.stx) override = context.stx.translateIf(override);
					n.text(override);
					n.stxtap(
						(function (self, override) {
							return function () {
								self.pickColor(override);
							};
						})(this, override)
					);
				}
			}

			if (!this.picker.hasClass("stxMenuActive")) {
				this.picker[0].open({ context: context }); // Manually activate the color picker
			} else {
				if (context.e) context.e.stopPropagation(); // Otherwise the color picker is closed when you swap back and forth between fill and line swatches on the toolbar
			}
		}

		initialize() {
			var self = this;
			this.picker = $(this);
			this.colors = this.picker.find("cq-colors");
			if (!this.colors.length) this.colors = this.picker;
			this.colors.empty(); // allow re-initialize, with new colors for instance

			function closure(self, color) {
				return function () {
					self.pickColor(color);
				};
			}
			for (var a = 0; a < this.params.colorMap.length; a++) {
				var lineOfColors = this.params.colorMap[a];
				var ul = $("<UL></UL>").appendTo(this.colors);
				for (var b = 0; b < lineOfColors.length; b++) {
					var li = $("<LI></LI>").appendTo(ul);
					var span = $("<SPAN></SPAN>").appendTo(li);
					span.css({ "background-color": lineOfColors[b] });
					span.stxtap(closure(self, lineOfColors[b]));
				}
			}
		}

		/**
		 * @param color
		 * @alias pickColor
		 * @memberof WebComponents.cq-color-picker
		 */
		pickColor(color) {
			if (this.callback) this.callback(color);
			this.close();
		}

		resize() {
			// do nothing for resize, overrides Dialog default which centers
		}

		/**
		 * @param {object} colorMap Object that holds an array of various color arrays.
		 * @alias setColors
		 * @memberof WebComponents.cq-color-picker
		 */
		setColors(colorMap) {
			this.params.colorMap = colorMap;
			this.initialize();
		}
	}

	CIQ.UI.ColorPicker = ColorPicker;
	customElements.define("cq-color-picker", ColorPicker);

	/**
	 * Menu DropDown web component `<cq-menu-dropdown>`.
	 *
	 * Menu DropDown handles holding the items that go inside a custom menu component.
	 *
	 * Menu DropDown is a semantic element to be used in menus that has the same functionality as {@link WebComponents.cq-scroll} The main difference is that Menu DropDown sets noMaximize to true which means that the component will not automatically resize.
	 *
	 * @namespace WebComponents.cq-menu-dropdown
	 * @example
	 <cq-menu class="ciq-menu ciq-studies collapse">
		 <span>Studies</span>
		 <cq-menu-dropdown cq-no-scroll>
			 <cq-study-legend cq-no-close>
				 <cq-section-dynamic>
					 <cq-heading>Current Studies</cq-heading>
					 <cq-study-legend-content>
						 <template>
							 <cq-item>
								 <cq-label class="click-to-edit"></cq-label>
								 <div class="ciq-icon ciq-close"></div>
							 </cq-item>
						 </template>
					 </cq-study-legend-content>
					 <cq-placeholder>
						 <div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
					 </cq-placeholder>
				 </cq-section-dynamic>
			 </cq-study-legend>
			 <cq-scroll>
				 <cq-studies>
				 	 <cq-studies-content>
						<template>
							<cq-item>
								<cq-label></cq-label>
							</cq-item>
						</template>
					 </cq-studies-content>
				 </cq-studies>
			 </cq-scroll>
		 </cq-menu-dropdown>
	 * @since 7.0.0 no longer dual inherits CIQ.UI.BaseComponent and CIQ.UI.Scroll. Now directly inherits Scroll which extends BaseComponent.
	 */
	class MenuDropDown extends CIQ.UI.Scroll {
		constructor() {
			super();
			this.noMaximize = true;
		}
	}

	CIQ.UI.MenuDropDown = MenuDropDown;
	customElements.define("cq-menu-dropdown", MenuDropDown);

	return _exports;
});
