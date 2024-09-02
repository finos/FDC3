/* eslint-disable no-undef */
// Copyright 2014-2018 by ChartIQ, Inc.
//
// Sample market symbology file
// Customize this file if you need symbology definitions different from these default settings
//

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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for marketSymbologySample.js.");
	}
})(function (_exports) {
	var CIQ = _exports.CIQ;

	CIQ.Market.Symbology = function () {};

	/**
	 * Returns true if the instrument is foreign.
	 * By default, if the instrument contains a period (.) it will be considered foreign (non US). (e.g. VOD.L)
	 *
	 * @param  {string}  symbol The symbol
	 * @return {boolean}        True if it's a foreign symbol
	 */
	CIQ.Market.Symbology.isForeignSymbol = function (symbol) {
		if (!symbol) return false;
		return symbol.indexOf(".") != -1;
	};

	/**
	 * Returns true if the instrument is a future.
	 * By default, if the symbol begins with `/` it will be considered a future. (e.g. /C)
	 *
	 * @param  {string}  symbol The symbol
	 * @return {boolean}        True if it's a futures symbol
	 */
	CIQ.Market.Symbology.isFuturesSymbol = function (symbol) {
		if (!symbol) return false;
		return symbol.length > 1 && symbol[0] == "/";
	};

	/**
	 * Returns true if the instrument is a forex symbol.
	 * By default, if the symbol begins with `^` and is followed by 6 alpha characters, or just 6 alpha characters long without a '^', it will be considered forex.(e.g. ^EURUSD)
	 *
	 * @param  {string}  symbol The symbol
	 * @return {boolean}        True if it's a forex symbol
	 */
	CIQ.Market.Symbology.isForexSymbol = function (symbol) {
		if (!symbol) return false;
		if (CIQ.Market.Symbology.isForeignSymbol(symbol)) return false;
		if (CIQ.Market.Symbology.isFuturesSymbol(symbol)) return false;
		if (symbol.length < 6 || symbol.length > 7) return false;
		if (symbol.length == 6 && symbol[5] == "X") return false; // This is a fund of some sort
		if (/\^?[A-Za-z]{6}/.test(symbol)) return true;
		return false;
	};

	/**
	 * Returns true if the symbol is a metal/currency or currency/metal pair
	 * By default, it must be a forex for a precious metal. (e.g. ^XAUUSD - looks for XAU,XPD,XPT,XAG only)
	 *
	 * @param  {string}   symbol The symbol
	 * @param  {boolean}  inverse Set to true to test specifically for a currency/metal pair (e.g. EURXAU, but not XAUEUR).
	 * @return {boolean}  True if it's a metal symbol
	 */
	CIQ.Market.Symbology.isForexMetal = function (symbol, inverse) {
		var metalsSupported = {
			XAU: true,
			XAG: true,
			XPT: true,
			XPD: true,
		};
		if (!symbol) return false;
		if (!CIQ.Market.Symbology.isForexSymbol(symbol)) return false;
		if (symbol.charAt(0) != "^") symbol = "^" + symbol;
		if (!metalsSupported[symbol.substring(1, 4)] && metalsSupported[symbol.substring(4, 7)]) return true;
		else if (!inverse && metalsSupported[symbol.substring(1, 4)] && !metalsSupported[symbol.substring(4, 7)])
			return true;
		return false;
	};

	/**
	 * Returns the market definition of a symbolObject.
	 *
	 * @param  {object} symbolObject Symbol object of form accepted by {@link CIQ.ChartEngine#loadChart}
	 * @return {object} A market definition. See {@link CIQ.Market} for instructions.
	 */
	CIQ.Market.Symbology.factory = function (symbolObject) {
		var symbol = symbolObject.symbol;
		if (CIQ.Market.Symbology.isForeignSymbol(symbol)) return null; // 24 hour market definition
		if (CIQ.Market.Symbology.isFuturesSymbol(symbol)) return CIQ.Market.GLOBEX;
		if (CIQ.Market.Symbology.isForexMetal(symbol)) return CIQ.Market.METALS;
		if (CIQ.Market.Symbology.isForexSymbol(symbol)) return CIQ.Market.FOREX;
		return CIQ.Market.NYSE;
	};

	return _exports;
});
