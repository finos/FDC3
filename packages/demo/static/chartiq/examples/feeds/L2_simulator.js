/* eslint-disable no-undef */
// -------------------------------------------------------------------------------------------
// Copyright 2012-2020 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
/*
 * Simulator for the crypto package.  Used only to demonstrate functionality.
 *
 * ****************************
 * Your implementation should simply call updateCurrentMarketData() as documented in
 * https://documentation.chartiq.comCIQ.ChartEngine.html#updateCurrentMarketData
 * *************************
 *
 * To Start: load this file and call `CIQ.simulateL2(params)` where params is an object:
 * params.stx - chart engine
 * params.rangeFactor - normally spread is 5%.  To vary that, set this to a number to multiply the spread.  For example, setting to 2 would change the spread to 10%
 * params.onInterval - millisecond interval to create L2 records
 * params.onTrade - set to true to create L2 records when the regular quote updates occur
 * If masterData is empty, simulator will generate Last quote as well.  Otherwise it gets Last from the masterData's most recent Close.
 */

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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for L2_simulator.js.");
	}
})(function (_exports) {
	var CIQ = _exports.CIQ;

	CIQ.simulateL2 = function (params) {
		function moveBidAsk(close) {
			function formatData(d) {
				var ret = [];
				for (var i = 0; i < d.price.length; i++) {
					if (!d.volume[i]) continue;
					var arr = [d.price[i], d.volume[i]];
					var obj = {};
					for (var f in d) {
						if (f == "price" || f == "volume") continue;
						obj[f] = d[f][i];
					}
					arr.push(obj);
					ret.push(arr);
				}
				return ret;
			}
			var data = {
				BidL2: {
					price: [
						-0.074,
						-0.073,
						-0.07,
						-0.056,
						-0.05,
						-0.044,
						-0.043,
						-0.04,
						-0.039,
						-0.038,
						-0.037,
						-0.036,
						-0.035,
						-0.034,
						-0.033,
						-0.03,
						-0.029,
						-0.028,
						-0.027,
						-0.026,
						-0.025,
						-0.024,
						-0.022,
						-0.021,
						-0.02,
						-0.019,
						-0.018,
						-0.017,
						-0.016,
						-0.015,
						-0.014,
						-0.013,
						-0.012,
						-0.011,
						-0.01,
						-0.009,
						-0.008,
						-0.007,
						-0.006,
						-0.005,
						-0.004,
						-0.003,
						-0.002,
						-0.001,
					],
					volume: [
						1,
						2,
						3,
						2,
						5,
						1,
						12,
						6,
						7,
						1,
						3,
						4,
						1,
						1,
						25,
						3,
						2,
						1,
						2,
						37,
						10,
						43,
						8,
						4,
						3,
						1,
						60,
						5,
						7,
						59,
						3,
						1,
						4,
						7,
						89,
						8,
						95,
						5,
						16,
						123,
						7,
						12,
						207,
						25,
					],
					Source: [
						"a",
						"b",
						"f",
						"e",
						"c",
						"c",
						"f",
						"b",
						"f",
						"h",
						"h",
						"c",
						"d",
						"e",
						"d",
						"d",
						"c",
						"b",
						"h",
						"f",
						"f",
						"c",
						"g",
						"b",
						"c",
						"d",
						"e",
						"b",
						"a",
						"d",
						"f",
						"b",
						"a",
						"a",
						"a",
						"c",
						"b",
						"b",
						"c",
						"d",
						"c",
						"e",
						"b",
						"d",
					],
				},
				AskL2: {
					price: [
						0.001,
						0.002,
						0.003,
						0.004,
						0.005,
						0.006,
						0.007,
						0.008,
						0.009,
						0.01,
						0.011,
						0.012,
						0.013,
						0.014,
						0.015,
						0.016,
						0.018,
						0.019,
						0.02,
						0.021,
						0.022,
						0.023,
						0.024,
						0.025,
						0.026,
						0.027,
						0.028,
						0.029,
						0.033,
						0.034,
						0.035,
						0.036,
						0.037,
						0.038,
						0.039,
						0.04,
						0.041,
						0.042,
						0.044,
						0.046,
						0.047,
						0.051,
						0.058,
						0.06,
						0.063,
						0.077,
					],
					volume: [
						3,
						225,
						34,
						14,
						189,
						6,
						2,
						11,
						134,
						12,
						121,
						6,
						2,
						9,
						7,
						3,
						1,
						88,
						4,
						1,
						3,
						5,
						4,
						6,
						10,
						54,
						9,
						1,
						2,
						1,
						40,
						2,
						2,
						4,
						3,
						2,
						4,
						1,
						1,
						3,
						12,
						6,
						1,
						2,
						1,
						1,
					],
					Source: [
						"a",
						"b",
						"a",
						"d",
						"e",
						"d",
						"g",
						"a",
						"c",
						"c",
						"c",
						"f",
						"b",
						"c",
						"d",
						"e",
						"b",
						"a",
						"d",
						"c",
						"b",
						"h",
						"f",
						"f",
						"c",
						"g",
						"b",
						"d",
						"f",
						"h",
						"h",
						"c",
						"d",
						"e",
						"d",
						"f",
						"b",
						"a",
						"a",
						"d",
						"c",
						"f",
						"e",
						"e",
						"b",
						"d",
					],
				},
			};
			var chart = this.chart;
			var mid = close;

			var shadowBreaks = [
				[1000, 2],
				[10, 4],
				[0.001, 8],
			];
			var roundOffFactor = 0;
			for (var j = 0; j < shadowBreaks.length; j++) {
				var brk = shadowBreaks[j];
				if (close < brk[0]) roundOffFactor = brk[1];
			}
			var bids = data.BidL2.price,
				asks = data.AskL2.price,
				i;
			for (i = 0; i < bids.length; i++) {
				bids[i] = CIQ.round(close * (1 + bids[i]), roundOffFactor);
			}
			for (i = 0; i < asks.length; i++) {
				asks[i] = CIQ.round(close * (1 + asks[i]), roundOffFactor);
			}
			var bidVs = data.BidL2.volume,
				askVs = data.AskL2.volume;
			for (i = 0; i < bidVs.length; i++) {
				bidVs[i] = Math.max(0, bidVs[i] + Math.round(10 * Math.random() - 5));
			}
			for (i = 0; i < askVs.length; i++) {
				askVs[i] = Math.max(0, askVs[i] + Math.round(10 * Math.random() - 5));
			}
			for (i = 0; i < bidVs.length; i++) {
				if (bidVs[i]) {
					data.Bid = bids[i];
					data.BidSize = bidVs[i];
				}
			}
			for (i = askVs.length - 1; i >= 0; i--) {
				if (askVs[i]) {
					data.Ask = asks[i];
					data.AskSize = askVs[i];
				}
			}
			data.BidL2 = formatData(data.BidL2);
			data.AskL2 = formatData(data.AskL2);

			return data;
		}

		function onTrade(appendQuotes, chart, params) {
			if (params !== undefined && params.animationEntry) return;
			for (var i = 0; i < appendQuotes.length; i++) {
				//if(appendQuotes[i].BidL2 || appendQuotes[i].AskL2) continue;  // already have data
				CIQ.ensureDefaults(appendQuotes[i], moveBidAsk.call(this, appendQuotes[i].Close));
				if (this.chart.market.isOpen()) {
					appendQuotes[i].LastSize = Math.round(Math.random() * 100);
					if (
						(this.layout.timeUnit != "second" && this.layout.timeUnit != "millisecond") |
						(this.layout.timeUnit == "second" && this.layout.interval > 1)
					)
						appendQuotes[i].LastTime = new Date();
				}
			}
			if (params.callback) params.callback.call(this);
		}

		function onInterval(stx) {
			return function () {
				if (!stx.chart.symbol) return;
				var close = null,
					md = stx.masterData;
				if (md && md.length) {
					if (stx.chart.currentMarketData.Last) {
						close = stx.chart.currentMarketData.Last.Price;
					} else {
						close = md[md.length - 1].Close;
					}
				}
				var randomClose = 100 + Math.round(10 * Math.random() - 5) * 0.01;
				var data = moveBidAsk.call(stx, close || randomClose);
				if (close === null) {
					data.Last = randomClose;
					data.LastSize = Math.round(Math.random() * 100);
				}
				data.DT = new Date();
				stx.updateCurrentMarketData(data);
				if (params.callback) params.callback.call(stx);
			};
		}

		if (params.onTrade) params.stx.prepend("updateChartData", onTrade);
		if (params.onInterval) setInterval(onInterval(params.stx), params.onInterval);
	};

	return _exports;
});
