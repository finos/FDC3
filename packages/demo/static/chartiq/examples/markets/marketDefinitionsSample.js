/* eslint-disable no-undef */
// Copyright 2014-2018 by ChartIQ, Inc.
//
// Sample market definitions file
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
		throw new Error("Only CommonJS, RequireJS, and <script> tags supported for marketDefinitionsSample.js.");
	}
})(function (_exports) {
	var CIQ = _exports.CIQ;

	CIQ.Market.GLOBEX = {
		name: "GLOBEX",
		market_tz: "America/Chicago",
		hour_aligned: true,
		rules: [
			{ dayofweek: 0, open: "15:00", close: "24:00" }, //sun
			{ dayofweek: 1, open: "00:00", close: "24:00" },
			{ dayofweek: 2, open: "00:00", close: "24:00" },
			{ dayofweek: 3, open: "00:00", close: "24:00" },
			{ dayofweek: 4, open: "00:00", close: "24:00" },
			{ dayofweek: 5, open: "00:00", close: "18:00" },
		],
	};

	CIQ.Market.FOREX = {
		name: "FOREX",
		market_tz: "America/New_York",
		hour_aligned: true,
		rules: [
			{ dayofweek: 0, open: "15:00", close: "17:00" }, //  9AM Mon NZ time in the winter and 7AM Mon NZ time in the summer.
			{ dayofweek: 0, open: "17:00", close: "24:00" },
			{ dayofweek: 1, open: "00:00", close: "17:00" },
			{ dayofweek: 1, open: "17:00", close: "24:00" },
			{ dayofweek: 2, open: "00:00", close: "17:00" },
			{ dayofweek: 2, open: "17:00", close: "24:00" },
			{ dayofweek: 3, open: "00:00", close: "17:00" },
			{ dayofweek: 3, open: "17:00", close: "24:00" },
			{ dayofweek: 4, open: "00:00", close: "17:00" },
			{ dayofweek: 4, open: "17:00", close: "24:00" },
			{ dayofweek: 5, open: "00:00", close: "17:00" },
		],
	};

	CIQ.Market.METALS = {
		name: "METALS",
		market_tz: "America/New_York",
		hour_aligned: true,
		rules: [
			{ dayofweek: 0, open: "18:00", close: "24:00" },
			{ dayofweek: 1, open: "00:00", close: "17:15" },
			{ dayofweek: 1, open: "18:00", close: "24:00" },
			{ dayofweek: 2, open: "00:00", close: "17:15" },
			{ dayofweek: 2, open: "18:00", close: "24:00" },
			{ dayofweek: 3, open: "00:00", close: "17:15" },
			{ dayofweek: 3, open: "18:00", close: "24:00" },
			{ dayofweek: 4, open: "00:00", close: "17:15" },
			{ dayofweek: 4, open: "18:00", close: "24:00" },
			{ dayofweek: 5, open: "00:00", close: "17:15" },
		],
	};

	CIQ.Market.NYSE = {
		name: "NYSE",
		market_tz: "America/New_York",
		hour_aligned: false,
		rules: [
			//First open up the regular trading times
			//Note that sat and sun (in this example) are always closed because
			//everything is closed by default and we didn't explicitly open
			//them.
			{ dayofweek: 1, open: "09:30", close: "16:00" }, //mon
			{ dayofweek: 2, open: "09:30", close: "16:00" },
			{ dayofweek: 3, open: "09:30", close: "16:00" },
			{ dayofweek: 4, open: "09:30", close: "16:00" },
			{ dayofweek: 5, open: "09:30", close: "16:00" }, //fri

			//After Hours premarket
			{ dayofweek: 1, open: "04:00", close: "09:30", name: "pre" }, //mon
			{ dayofweek: 2, open: "04:00", close: "09:30", name: "pre" },
			{ dayofweek: 3, open: "04:00", close: "09:30", name: "pre" },
			{ dayofweek: 4, open: "04:00", close: "09:30", name: "pre" },
			{ dayofweek: 5, open: "04:00", close: "09:30", name: "pre" }, //fri

			//After Hours post
			{ dayofweek: 1, open: "16:00", close: "20:00", name: "post" }, //mon
			{ dayofweek: 2, open: "16:00", close: "20:00", name: "post" },
			{ dayofweek: 3, open: "16:00", close: "20:00", name: "post" },
			{ dayofweek: 4, open: "16:00", close: "20:00", name: "post" },
			{ dayofweek: 5, open: "16:00", close: "20:00", name: "post" }, //fri

			//Now mon thru friday is open. Close any exceptions

			//always closed on Christmas
			{ date: "*-12-25", open: "00:00", close: "00:00" },

			//always closed on 4th of July
			{ date: "*-07-04", open: "00:00", close: "00:00" },

			//always close on new years day
			{ date: "*-01-01", open: "00:00", close: "00:00" },

			//Some holidays are observed on different days each year or if
			//the day falls on a weekend. Each of those rules must be specified.
			{ date: "2012-01-02", open: "00:00", close: "00:00" },

			//As a special case if no open and close attributes are set they
			//will be assumed "00:00" and "00:00" respectively
			{ date: "2019-01-21" },
			{ date: "2019-02-18" },
			{ date: "2019-04-19" },
			{ date: "2019-05-27" },
			{ date: "2019-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2019-07-03", open: "9:30", close: "13:00" },
			{ date: "2019-09-02" },
			{ date: "2019-11-28" },
			{ date: "2019-11-29", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2019-11-29", open: "9:30", close: "13:00" },
			{ date: "2019-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2019-12-24", open: "9:30", close: "13:00" },

			{ date: "2018-01-15" },
			{ date: "2018-02-19" },
			{ date: "2018-03-30" },
			{ date: "2018-05-28" },
			{ date: "2018-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2018-07-03", open: "9:30", close: "13:00" },
			{ date: "2018-09-03" },
			{ date: "2018-11-22" },
			{ date: "2018-11-23", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2018-11-23", open: "9:30", close: "13:00" },
			{ date: "2018-12-05" },
			{ date: "2018-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2018-12-24", open: "9:30", close: "13:00" },

			{ date: "2017-01-02" },
			{ date: "2017-01-16" },
			{ date: "2017-02-20" },
			{ date: "2017-04-14" },
			{ date: "2017-05-29" },
			{ date: "2017-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2017-07-03", open: "9:30", close: "13:00" },
			{ date: "2017-09-04" },
			{ date: "2017-11-23" },
			{ date: "2017-11-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2017-11-24", open: "9:30", close: "13:00" },

			{ date: "2016-01-18" },
			{ date: "2016-02-15" },
			{ date: "2016-03-25" },
			{ date: "2016-05-30" },
			{ date: "2016-09-05" },
			{ date: "2016-11-24" },
			{ date: "2016-11-25", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2016-11-25", open: "9:30", close: "13:00" },
			{ date: "2016-12-26" },

			{ date: "2015-01-19" },
			{ date: "2015-02-16" },
			{ date: "2015-04-03" },
			{ date: "2015-05-25" },
			{ date: "2015-07-03" },
			{ date: "2015-09-07" },
			{ date: "2015-11-26" },
			{ date: "2015-11-27", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2015-11-27", open: "9:30", close: "13:00" },
			{ date: "2015-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2015-12-24", open: "9:30", close: "13:00" },

			{ date: "2014-01-20" },
			{ date: "2014-02-17" },
			{ date: "2014-04-18" },
			{ date: "2014-05-26" },
			{ date: "2014-09-01" },
			{ date: "2014-11-27" },
			{ date: "2014-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2014-07-03", open: "9:30", close: "13:00" },
			{ date: "2014-11-28", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2014-11-28", open: "9:30", close: "13:00" },
			{ date: "2014-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2014-12-24", open: "9:30", close: "13:00" },

			{ date: "2013-01-21" },
			{ date: "2013-02-18" },
			{ date: "2013-03-29" },
			{ date: "2013-05-27" },
			{ date: "2013-09-02" },
			{ date: "2013-11-28" },
			{ date: "2013-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2013-07-03", open: "9:30", close: "13:00" },
			{ date: "2013-11-29", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2013-11-29", open: "9:30", close: "13:00" },
			{ date: "2013-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2013-12-24", open: "9:30", close: "13:00" },

			{ date: "2012-01-16" },
			{ date: "2012-02-20" },
			{ date: "2012-04-06" },
			{ date: "2012-05-28" },
			{ date: "2012-09-03" },
			{ date: "2012-10-29" },
			{ date: "2012-10-30" },
			{ date: "2012-11-22" },
			{ date: "2012-07-03", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2012-07-03", open: "9:30", close: "13:00" },
			{ date: "2012-11-23", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2012-11-23", open: "9:30", close: "13:00" },
			{ date: "2012-12-24", open: "4:00", close: "9:30", name: "pre" },
			{ date: "2012-12-24", open: "9:30", close: "13:00" },
		],
	};

	CIQ.Market.LSE = {
		name: "London",
		market_tz: "Europe/London",
		hour_aligned: false,
		rules: [
			//First open up the regular trading times
			//Note that sat and sun (in this example) are always closed because
			//everything is closed by default and we didn't explicitly open
			//them.
			{ dayofweek: 1, open: "08:00", close: "17:00" }, //mon
			{ dayofweek: 2, open: "08:00", close: "17:00" },
			{ dayofweek: 3, open: "08:00", close: "17:00" },
			{ dayofweek: 4, open: "08:00", close: "17:00" },
			{ dayofweek: 5, open: "08:00", close: "17:00" }, //fri

			//Now mon thru friday is open. Close any exceptions

			//always closed on Christmas and boxing day
			{ date: "*-12-25", open: "00:00", close: "00:00" },
			{ date: "*-12-26", open: "00:00", close: "00:00" },

			//always close on new years day
			{ date: "*-01-01", open: "00:00", close: "00:00" },

			//Some holidays are observed on different days each year or if
			//the day falls on a weekend. Each of those rules must be specified.
			{ date: "2012-01-02", open: "00:00", close: "00:00" },

			//As a special case if no open and close attributes are set they
			//will be assumed "00:00" and "00:00" respectively
			{ date: "2019-04-19" },
			{ date: "2019-04-22" },
			{ date: "2019-05-06" },
			{ date: "2019-05-27" },
			{ date: "2019-08-26" },
			{ date: "2019-12-24", open: "8:00", close: "12:30" },

			{ date: "2018-03-30" },
			{ date: "2018-04-02" },
			{ date: "2018-05-07" },
			{ date: "2018-05-28" },
			{ date: "2018-08-27" },
			{ date: "2018-12-24", open: "8:00", close: "12:30" },
			{ date: "2018-12-31", open: "8:00", close: "12:30" },

			{ date: "2017-01-02" },
			{ date: "2017-04-14" },
			{ date: "2017-04-17" },
			{ date: "2017-05-01" },
			{ date: "2017-05-29" },
			{ date: "2017-08-28" },
			{ date: "2017-12-22", open: "8:00", close: "12:30" },
			{ date: "2017-12-29", open: "8:00", close: "12:30" },

			{ date: "2016-03-25" },
			{ date: "2016-03-28" },
			{ date: "2016-05-02" },
			{ date: "2016-05-30" },
			{ date: "2016-08-29" },
			{ date: "2016-12-23", open: "8:00", close: "12:30" },
			{ date: "2016-12-27" },
			{ date: "2016-12-30", open: "8:00", close: "12:30" },

			{ date: "2015-04-03" },
			{ date: "2015-04-06" },
			{ date: "2015-05-04" },
			{ date: "2015-05-25" },
			{ date: "2015-08-31" },
			{ date: "2015-12-24", open: "8:00", close: "12:30" },
			{ date: "2015-12-28" },
			{ date: "2015-12-31", open: "8:00", close: "12:30" },

			{ date: "2014-04-18" },
			{ date: "2014-04-21" },
			{ date: "2014-05-05" },
			{ date: "2014-05-26" },
			{ date: "2014-08-25" },
			{ date: "2014-12-24", open: "8:00", close: "12:30" },
			{ date: "2014-12-31", open: "8:00", close: "12:30" },

			{ date: "2013-03-29" },
			{ date: "2013-04-01" },
			{ date: "2013-05-06" },
			{ date: "2013-05-27" },
			{ date: "2013-08-26" },
			{ date: "2013-12-24", open: "8:00", close: "12:30" },
			{ date: "2013-12-31", open: "8:00", close: "12:30" },

			{ date: "2012-01-02" },
			{ date: "2012-04-06" },
			{ date: "2012-04-09" },
			{ date: "2012-05-07" },
			{ date: "2012-06-04" },
			{ date: "2012-06-05" },
			{ date: "2012-08-27" },
			{ date: "2012-12-24", open: "8:00", close: "12:30" },
			{ date: "2012-12-31", open: "8:00", close: "12:30" },
		],
	};

	return _exports;
});
