/* eslint-disable no-undef */
// -------------------------------------------------------------------------------------------
// Copyright 2012-2019 by ChartIQ, Inc
// -------------------------------------------------------------------------------------------
// SAMPLE SYMBOL LOOKUP IMPLEMENTATION -- Connects to ChartIQ Lookup Server
///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for symbolLookupChartIQ.js.");
	}
})(function (_exports) {
	var CIQ = _exports.CIQ;

	/**
	 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @param {array} exchanges An array of exchanges that can be searched against
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ = function (exchanges) {
		this.exchanges = exchanges;
		if (!this.exchanges)
			this.exchanges = [
				"XNYS",
				"XASE",
				"XNAS",
				"XASX",
				"INDCBSX",
				"INDXASE",
				"INDXNAS",
				"IND_DJI",
				"ARCX",
				"INDARCX",
				"forex",
			];
		this.url = "https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
		this.requestCounter = 0; //used to invalidate old requests
		//t=ibm&m=10&x=[]&e=STOCKS
	};

	/**
	 * An example instance of the Driver Lookup scoped to CIQ.ChartEngine.Driver.Lookup
	 *
	 * Inherits all of the base Driver Lookup's properties via `ciqInheritsFrom()`
	 * @name ChartIQ
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ.ciqInheritsFrom(CIQ.ChartEngine.Driver.Lookup);

	/**
	 * @memberof CIQ.ChartEngine.Driver.Lookup.ChartIQ
	 * @param {string} text Text to search for
	 * @param {string} filter Any filter to be applied to the search results
	 * @param {number} maxResults Max number of results to return from the server
	 * @param {function} cb Callback upon results
	 * @private
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.ChartIQ.prototype.acceptText = function (text, filter, maxResults, cb) {
		if (filter == "FX") filter = "FOREX";
		if (isNaN(parseInt(maxResults, 10))) maxResults = 100;
		var url = this.url + "?t=" + encodeURIComponent(text) + "&m=" + maxResults + "&x=[";
		if (this.exchanges) {
			url += this.exchanges.join(",");
		}
		url += "]";
		if (filter && filter.toUpperCase() != "ALL") {
			url += "&e=" + filter;
		}

		var counter = ++this.requestCounter;
		var self = this;
		function handleResponse(status, response) {
			if (counter < self.requestCounter) return;
			if (status != 200) return;
			try {
				response = JSON.parse(response);
				var symbols = response.payload.symbols;

				var results = [];
				for (var i = 0; i < symbols.length; i++) {
					var fields = symbols[i].split("|");
					var item = {
						symbol: fields[0],
						name: fields[1],
						exchDisp: fields[2],
					};
					results.push({
						display: [item.symbol, item.name, item.exchDisp],
						data: item,
					});
				}
				cb(results);
			} catch (e) {}
		}
		CIQ.postAjax({ url: url, cb: handleResponse });
	};

	return _exports;
});
