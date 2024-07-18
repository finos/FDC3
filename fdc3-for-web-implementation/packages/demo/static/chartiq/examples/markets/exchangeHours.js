var CIQ; // linter

/* This file contains Market Definitions for the major stock exchanges.
ChartIQ will update this file periodically but please check to make sure the hours and holidays
are accurate for your exchange. If you find errors please let us know! dev@cosaic.io

Since this is a large file we recommend that you cut and paste definitions into your own code.

Remember that a market with a hyphen is not valid in Typescript and change them to use bracket notation.
Easiest way to see if any market needs changing is to run "npm run eslint" locally.

Current list of markets that need changing
CIQ.Market["XSHG-USD"] 
CIQ.Market["XIST-ISB"] 
CIQ.Market["XBOM-CRD"]
CIQ.Market["XEUE-AMS"]
CIQ.Market["XNSE-CRD"]
*/

CIQ.Market.ALTX = {
	market_tz: "Africa/Johannesburg",
	name: "AltX (Division of Johannesburg Stock Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "17:15",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-21",
			name: "Human Rights Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2018-04-27",
			name: "Freedom Day",
		},
		{
			date: "2018-05-01",
			name: "Workers' Day",
		},
		{
			date: "2018-08-09",
			name: "National Women's Day",
		},
		{
			date: "2018-09-24",
			name: "Heritage Day",
		},
		{
			date: "2018-12-17",
			name: "Day of Reconciliation OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Day of Goodwill",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-21",
			name: "Human Rights Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2019-05-01",
			name: "Workers' Day",
		},
		{
			date: "2019-06-17",
			name: "Youth Day OBS",
		},
		{
			date: "2019-08-09",
			name: "National Women's Day",
		},
		{
			date: "2019-09-24",
			name: "Heritage Day",
		},
		{
			date: "2019-12-16",
			name: "Day of Reconciliation",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Day of Goodwill",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2020-04-27",
			name: "Freedom Day",
		},
		{
			date: "2020-05-01",
			name: "Workers' Day",
		},
		{
			date: "2020-06-16",
			name: "Youth Day",
		},
		{
			date: "2020-08-10",
			name: "National Women's Day OBS",
		},
		{
			date: "2020-09-24",
			name: "Heritage Day",
		},
		{
			date: "2020-12-16",
			name: "Day of Reconciliation",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:15",
		},
		{
			date: "2019-12-31",
			open: "08:30",
			close: "12:15",
		},
	],
};

CIQ.Market.ARCX = {
	market_tz: "America/New_York",
	name: "NYSE Arca",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.BATE = {
	market_tz: "Europe/London",
	name: "Cboe Europe BXE Order Book (UK) (formerly BATS)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:35",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:00",
			close: "12:40",
		},
		{
			date: "2019-12-31",
			open: "08:00",
			close: "12:40",
		},
	],
};

CIQ.Market.AQXE = {
	market_tz: "Europe/London",
	name: "Aquis Exchange (UK)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:35",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:00",
			close: "12:35",
		},
		{
			date: "2019-12-31",
			open: "08:00",
			close: "12:35",
		},
	],
};

CIQ.Market.BSEX = {
	market_tz: "Asia/Baku",
	name: "Baku Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year Holiday",
		},
		{
			date: "2018-01-03",
			name: "Day of Solidarity OBS",
		},
		{
			date: "2018-03-08",
			name: "Women's Day",
		},
		{
			date: "2018-03-20",
			name: "Novruz Bayram",
		},
		{
			date: "2018-03-21",
			name: "Novruz Bayram 1",
		},
		{
			date: "2018-03-22",
			name: "Novruz Bayram 2",
		},
		{
			date: "2018-03-23",
			name: "Novruz Bayram 3",
		},
		{
			date: "2018-03-26",
			name: "Novruz Bairam Holiday",
		},
		{
			date: "2018-04-11",
			name: "Election Day",
		},
		{
			date: "2018-05-09",
			name: "Victory Day",
		},
		{
			date: "2018-05-28",
			name: "Independence/Republic Day",
		},
		{
			date: "2018-06-15",
			name: "National Salvation Day",
		},
		{
			date: "2018-06-15",
			name: "Ramazan*",
		},
		{
			date: "2018-06-18",
			name: "Ramazan (additonal observance)*",
		},
		{
			date: "2018-06-19",
			name: "Bank and Market Holiday",
		},
		{
			date: "2018-06-26",
			name: "Armed Forces Day",
		},
		{
			date: "2018-08-22",
			name: "Gurban Bayram*",
		},
		{
			date: "2018-08-23",
			name: "Gurban Bayram 2*",
		},
		{
			date: "2018-11-09",
			name: "National Flag Day",
		},
		{
			date: "2018-12-31",
			name: "Day of Solidarity",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year Holiday",
		},
		{
			date: "2019-01-21",
			name: "Mourning Day OBS",
		},
		{
			date: "2019-03-08",
			name: "Women's Day",
		},
		{
			date: "2019-03-20",
			name: "Novruz Bayram",
		},
		{
			date: "2019-03-21",
			name: "Novruz Bayram 1",
		},
		{
			date: "2019-03-22",
			name: "Novruz Bayram 2",
		},
		{
			date: "2019-03-25",
			name: "Novruz Bairam Holiday",
		},
		{
			date: "2019-03-26",
			name: "Novruz Bayram Holiday 2",
		},
		{
			date: "2019-05-09",
			name: "Victory Day",
		},
		{
			date: "2019-05-28",
			name: "Independence/Republic Day",
		},
		{
			date: "2019-06-05",
			name: "Ramazan*",
		},
		{
			date: "2019-06-06",
			name: "Ramazan 2*",
		},
		{
			date: "2019-06-17",
			name: "National Salvation Day OBS",
		},
		{
			date: "2019-06-26",
			name: "Armed Forces Day",
		},
		{
			date: "2019-08-12",
			name: "Gurban Bayram 2*",
		},
		{
			date: "2019-11-11",
			name: "National Flag Day OBS",
		},
		{
			date: "2019-12-31",
			name: "Day of Solidarity",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year Holiday",
		},
		{
			date: "2020-01-20",
			name: "Mourning Day",
		},
		{
			date: "2020-03-09",
			name: "Women's Day OBS",
		},
		{
			date: "2020-03-19",
			name: "Novruz Bayram",
		},
		{
			date: "2020-03-20",
			name: "Novruz Bayram 1",
		},
		{
			date: "2020-03-23",
			name: "Novruz Bayram 4",
		},
		{
			date: "2020-05-11",
			name: "Victory Day OBS",
		},
		{
			date: "2020-05-25",
			name: "Ramazan 2*",
		},
		{
			date: "2020-05-28",
			name: "Independence/Republic Day",
		},
		{
			date: "2020-06-15",
			name: "National Salvation Day",
		},
		{
			date: "2020-06-26",
			name: "Armed Forces Day",
		},
		{
			date: "2020-07-31",
			name: "Gurban Bayram*",
		},
		{
			date: "2020-11-09",
			name: "National Flag Day",
		},
		{
			date: "2020-12-31",
			name: "Day of Solidarity",
		},
	],
};

CIQ.Market.BATY = {
	market_tz: "America/Chicago",
	name: "Cboe BYX US Equities Exchange (formerly BATS Y-Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-11-29",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:00",
		},
	],
};

CIQ.Market.BVMF = {
	market_tz: "America/Sao_Paulo",
	name: "B3 (formerly BM&FBOVESPA)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:45",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "09:45",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "09:45",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "09:45",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "09:45",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-25",
			name: "Foundation Day",
		},
		{
			date: "2018-02-12",
			name: "Carnival Monday",
		},
		{
			date: "2018-02-13",
			name: "Carnival Tuesday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-31",
			name: "Corpus Christi",
		},
		{
			date: "2018-07-09",
			name: "Sao Paulo Regional Holiday",
		},
		{
			date: "2018-09-07",
			name: "Independence Day",
		},
		{
			date: "2018-10-12",
			name: "Our Lady of Aparecida",
		},
		{
			date: "2018-11-02",
			name: "All Souls' Day",
		},
		{
			date: "2018-11-15",
			name: "Proclamation of Republic",
		},
		{
			date: "2018-11-20",
			name: "Zumbi dos Palmares Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2018-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-25",
			name: "Foundation Day",
		},
		{
			date: "2019-03-04",
			name: "Carnival Monday",
		},
		{
			date: "2019-03-05",
			name: "Carnival Tuesday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-20",
			name: "Corpus Christi",
		},
		{
			date: "2019-07-09",
			name: "Sao Paulo Regional Holiday",
		},
		{
			date: "2019-11-15",
			name: "Proclamation of Republic",
		},
		{
			date: "2019-11-20",
			name: "Zumbi dos Palmares Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2019-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-24",
			name: "Carnival Monday",
		},
		{
			date: "2020-02-25",
			name: "Carnival Tuesday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-21",
			name: "Tiradentes Day",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-11",
			name: "Corpus Christi",
		},
		{
			date: "2020-07-09",
			name: "Sao Paulo Regional Holiday",
		},
		{
			date: "2020-09-07",
			name: "Independence Day",
		},
		{
			date: "2020-10-12",
			name: "Our Lady of Aparecida",
		},
		{
			date: "2020-11-02",
			name: "All Souls' Day",
		},
		{
			date: "2020-11-20",
			name: "Zumbi dos Palmares Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2020-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2019-03-06",
			open: "12:45",
			close: "18:00",
		},
	],
};

CIQ.Market.CHIJ = {
	market_tz: "Asia/Tokyo",
	name: "Chi-X Japan",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.BATS = {
	market_tz: "America/Chicago",
	name: "Cboe BZX US Equities Exchange (formerly BATS Trading)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-11-29",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:00",
		},
	],
};

CIQ.Market.EDGA = {
	market_tz: "America/New_York",
	name: "Cboe EDGA US Equities Exchange (formerly BATS EDGA)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-11-29",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:00",
		},
	],
};

CIQ.Market.CHIA = {
	market_tz: "Australia/Sydney",
	name: "Chi-X Australia",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "16:13",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "16:13",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "16:13",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "16:13",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "16:13",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-26",
			name: "Australia Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2018-06-11",
			name: "Queen's Birthday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-28",
			name: "Australia Day OBS",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2019-06-10",
			name: "Queen's Birthday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Australia Day OBS",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-06-08",
			name: "Queen's Birthday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-28",
			name: "Boxing Day OBS",
		},
		{
			date: "2019-12-24",
			open: "10:00",
			close: "14:13",
		},
		{
			date: "2019-12-31",
			open: "10:00",
			close: "14:13",
		},
	],
};

CIQ.Market.IEXG = {
	market_tz: "America/New_York",
	name: "IEX Trading",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "15:50",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "15:50",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "15:50",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "15:50",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "15:50",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.MISX = {
	market_tz: "Europe/Moscow",
	name: "Moscow Exchange MICEX Main Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 2,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 3,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 4,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 5,
			open: "09:50",
			close: "18:50",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-01-08",
			name: "New Year's Holiday 3",
		},
		{
			date: "2018-02-23",
			name: "Defense of the Fatherland",
		},
		{
			date: "2018-03-08",
			name: "International Women's Day",
		},
		{
			date: "2018-05-01",
			name: "International Labour Day",
		},
		{
			date: "2018-05-09",
			name: "Victory Day",
		},
		{
			date: "2018-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2018-11-05",
			name: "National Unity Day OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-07",
			name: "Russian Orthodox Christmas",
		},
		{
			date: "2019-03-08",
			name: "International Women's Day",
		},
		{
			date: "2019-05-01",
			name: "International Labour Day",
		},
		{
			date: "2019-05-09",
			name: "Victory Day",
		},
		{
			date: "2019-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2019-11-04",
			name: "National Unity Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve Trading Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-07",
			name: "Russian Orthodox Christmas",
		},
		{
			date: "2020-03-09",
			name: "International Women's Day OBS",
		},
		{
			date: "2020-05-01",
			name: "International Labour Day",
		},
		{
			date: "2020-05-11",
			name: "Victory Day OBS",
		},
		{
			date: "2020-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2020-11-04",
			name: "National Unity Day",
		},
	],
};

CIQ.Market.MTAA = {
	market_tz: "Europe/Rome",
	name: "Borsa Italia MTA (Equities)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:42",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:42",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:42",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:42",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:42",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.ROCO = {
	market_tz: "Asia/Taipei",
	name: "Taipei Stock Exchange (formerly GreTai Securities Market)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "13:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-13",
			name: "LNY - No Trading 1",
		},
		{
			date: "2018-02-14",
			name: "LNY - No Trading 2",
		},
		{
			date: "2018-02-15",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Additional LNY Holiday",
		},
		{
			date: "2018-02-20",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2018-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2018-04-04",
			name: "Children's Day",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival",
		},
		{
			date: "2018-09-24",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2018-10-10",
			name: "National Day",
		},
		{
			date: "2018-12-31",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-31",
			name: "LNY - No Trading 1",
		},
		{
			date: "2019-02-01",
			name: "LNY - No Trading 2",
		},
		{
			date: "2019-02-04",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2019-03-01",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-04-04",
			name: "Children's Day",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival",
		},
		{
			date: "2019-09-13",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2019-10-10",
			name: "National Day",
		},
		{
			date: "2019-10-11",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-22",
			name: "LNY - No Trading 1",
		},
		{
			date: "2020-01-23",
			name: "LNY - No Trading 2",
		},
		{
			date: "2020-01-24",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Additional LNY Holiday",
		},
		{
			date: "2020-01-29",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2020-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2020-04-03",
			name: "Children's Day OBS",
		},
		{
			date: "2020-04-06",
			name: "Ching Ming Festival",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival",
		},
		{
			date: "2020-06-26",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2020-10-02",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-10-09",
			name: "Adjusted Holiday 3",
		},
	],
};

CIQ.Market.SBIJ = {
	market_tz: "Asia/Tokyo",
	rules: [
		{
			dayofweek: 1,
			open: "08:20",
			close: "16:00",
		},
		{
			dayofweek: 1,
			open: "19:00",
			close: "23:59",
		},
		{
			dayofweek: 2,
			open: "08:20",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "19:00",
			close: "23:59",
		},
		{
			dayofweek: 3,
			open: "08:20",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "19:00",
			close: "23:59",
		},
		{
			dayofweek: 4,
			open: "08:20",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "19:00",
			close: "23:59",
		},
		{
			dayofweek: 5,
			open: "08:20",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "19:00",
			close: "23:59",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Japannext",
	hour_aligned: false,
};

CIQ.Market.CHIX = {
	market_tz: "Asia/Tokyo",
	name: "Cboe Europe CXE Order Book (UK) (formerly Chi-X)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:35",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:35",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:00",
			close: "12:40",
		},
		{
			date: "2019-12-31",
			open: "08:00",
			close: "12:40",
		},
	],
};

CIQ.Market.ETLX = {
	market_tz: "Europe/Rome",
	name: "EuroTLX",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.SGEX = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 0,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 1,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 1,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 1,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 2,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 3,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 4,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "21:00",
			close: "24:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
	],
	name: "Shanghai Gold Exchange",
	hour_aligned: false,
};

CIQ.Market.SHSC = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-13",
			name: "No trading 1",
		},
		{
			date: "2018-02-14",
			name: "No trading 2",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-03",
			name: "No trading 3",
		},
		{
			date: "2018-04-04",
			name: "No trading 4",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-26",
			name: "No trading 5",
		},
		{
			date: "2018-04-27",
			name: "No trading 6",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-20",
			name: "No trading 7",
		},
		{
			date: "2018-09-21",
			name: "No trading 8",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-09-27",
			name: "No trading 9",
		},
		{
			date: "2018-09-28",
			name: "No trading 10",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-27",
			name: "No trading 11",
		},
		{
			date: "2018-12-28",
			name: "No trading 12",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-31",
			name: "No trading 1",
		},
		{
			date: "2019-02-01",
			name: "No trading 2",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-09-11",
			name: "No trading 4",
		},
		{
			date: "2019-09-12",
			name: "No trading 5",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-09-27",
			name: "No trading 6",
		},
		{
			date: "2019-09-30",
			name: "No trading 7",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
	name: "Shanghai-HK Stock Connect (Southbound Trading)",
	hour_aligned: false,
};

CIQ.Market.SEDX = {
	market_tz: "Europe/Rome",
	name: "Borsa Italia SeDex (Securitised Derivatives)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:35",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:35",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:35",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:35",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:35",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.WBAH = {
	market_tz: "Europe/Vienna",
	name: "Wienerborse - Main market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:55",
			close: "17:33",
		},
		{
			dayofweek: 2,
			open: "08:55",
			close: "17:33",
		},
		{
			dayofweek: 3,
			open: "08:55",
			close: "17:33",
		},
		{
			dayofweek: 4,
			open: "08:55",
			close: "17:33",
		},
		{
			dayofweek: 5,
			open: "08:55",
			close: "17:33",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-10",
			name: "Ascension Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-05-31",
			name: "Corpus Christi",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-10-26",
			name: "National Holiday",
		},
		{
			date: "2018-11-01",
			name: "All Saints' Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-06",
			name: "Epiphany",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-10-26",
			name: "National Holiday",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XADE = {
	market_tz: "Europe/Athens",
	name: "Athens Derivatives Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-19",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-28",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-11",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2019-03-25",
			name: "National Holiday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-17",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-10-28",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-06",
			name: "Epiphany",
		},
		{
			date: "2020-03-02",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2020-03-25",
			name: "National Holiday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-08",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2020-10-28",
			name: "National Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			open: "10:00",
			close: "15:00",
		},
	],
};

CIQ.Market.SZSC = {
	market_tz: "Asia/Hong_Kong",
	name: "Shenzhen-HK Stock Connect (Southbound Trading)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:20",
			close: "16:10",
		},
		{
			dayofweek: 2,
			open: "09:20",
			close: "16:10",
		},
		{
			dayofweek: 3,
			open: "09:20",
			close: "16:10",
		},
		{
			dayofweek: 4,
			open: "09:20",
			close: "16:10",
		},
		{
			dayofweek: 5,
			open: "09:20",
			close: "16:10",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-13",
			name: "No trading 1",
		},
		{
			date: "2018-02-14",
			name: "No trading 2",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-03",
			name: "No trading 3",
		},
		{
			date: "2018-04-04",
			name: "No trading 4",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-26",
			name: "No trading 5",
		},
		{
			date: "2018-04-27",
			name: "No trading 6",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-20",
			name: "No trading 7",
		},
		{
			date: "2018-09-21",
			name: "No trading 8",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-09-27",
			name: "No trading 9",
		},
		{
			date: "2018-09-28",
			name: "No trading 10",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-27",
			name: "No trading 11",
		},
		{
			date: "2018-12-28",
			name: "No trading 12",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-31",
			name: "No trading 1",
		},
		{
			date: "2019-02-01",
			name: "No trading 2",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-09-11",
			name: "No trading 4",
		},
		{
			date: "2019-09-12",
			name: "No trading 5",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-09-27",
			name: "No trading 6",
		},
		{
			date: "2019-09-30",
			name: "No trading 7",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XAIM = {
	market_tz: "Europe/Rome",
	name: "AIM Italia Alternative Investment Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "15:30",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "15:30",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "15:30",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "15:30",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "15:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XASX = {
	market_tz: "Australia/Sydney",
	name: "ASX (Australian Stock Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "16:12",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "16:12",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "16:12",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "16:12",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "16:12",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-26",
			name: "Australia Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2018-06-11",
			name: "Queen's Birthday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-28",
			name: "Australia Day OBS",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2019-06-10",
			name: "Queen's Birthday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Australia Day OBS",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-06-08",
			name: "Queen's Birthday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-28",
			name: "Boxing Day OBS",
		},
		{
			date: "2019-12-24",
			open: "10:00",
			close: "14:00",
		},
		{
			date: "2019-12-31",
			open: "10:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XASE = {
	market_tz: "America/New_York",
	name: "NYSE Amex Equities",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.XATH = {
	market_tz: "Europe/Athens",
	name: "Athens Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:29",
			close: "17:20",
		},
		{
			dayofweek: 2,
			open: "10:29",
			close: "17:20",
		},
		{
			dayofweek: 3,
			open: "10:29",
			close: "17:20",
		},
		{
			dayofweek: 4,
			open: "10:29",
			close: "17:20",
		},
		{
			dayofweek: 5,
			open: "10:29",
			close: "17:20",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-19",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-28",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-11",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2019-03-25",
			name: "National Holiday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-17",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-10-28",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-06",
			name: "Epiphany",
		},
		{
			date: "2020-03-02",
			name: "Shrove Monday (Orthodox)",
		},
		{
			date: "2020-03-25",
			name: "National Holiday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-08",
			name: "Whitmonday (Orthodox)",
		},
		{
			date: "2020-10-28",
			name: "National Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			open: "10:30",
			close: "15:20",
		},
	],
};

CIQ.Market.XAMS = {
	market_tz: "Europe/Amsterdam",
	name: "Euronext Amsterdam",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "14:00",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XBCL = {
	market_tz: "America/Santiago",
	name: "Bolsa Electronica de Chile",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-16",
			name: "Public Holiday 2",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2018-07-02",
			name: "Saints Peter and Paul OBS",
		},
		{
			date: "2018-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-09-17",
			name: "Public Holiday",
		},
		{
			date: "2018-09-18",
			name: "Independence Day",
		},
		{
			date: "2018-09-19",
			name: "Army Day",
		},
		{
			date: "2018-10-15",
			name: "Columbus Day OBS",
		},
		{
			date: "2018-11-01",
			name: "All Saints' Day",
		},
		{
			date: "2018-11-02",
			name: "Evangelical Church Day OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2019-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-09-18",
			name: "Independence Day",
		},
		{
			date: "2019-09-19",
			name: "Army Day",
		},
		{
			date: "2019-09-20",
			name: "Public Holiday",
		},
		{
			date: "2019-10-31",
			name: "Evangelical Church Day",
		},
		{
			date: "2019-11-01",
			name: "All Saints' Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2020-06-29",
			name: "Saints Peter and Paul",
		},
		{
			date: "2020-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2020-09-18",
			name: "Independence Day",
		},
		{
			date: "2020-10-12",
			name: "Columbus Day",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2019-04-18",
			open: "09:30",
			close: "13:30",
		},
		{
			date: "2019-09-17",
			open: "09:30",
			close: "13:30",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "12:30",
		},
		{
			date: "2019-12-30",
			open: "09:30",
			close: "12:30",
		},
	],
};

CIQ.Market.XBER = {
	market_tz: "Europe/Berlin",
	name: "Berlin Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.TRQX = {
	market_tz: "Europe/London",
	name: "Turquoise Equities (UK)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:30",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:30",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:30",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:30",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:00",
			close: "13:00",
		},
		{
			date: "2019-12-31",
			open: "08:00",
			close: "13:00",
		},
	],
};

CIQ.Market.XBKK = {
	market_tz: "Asia/Bangkok",
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "12:30",
		},
		{
			dayofweek: 1,
			open: "14:30",
			close: "16:30",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "12:30",
		},
		{
			dayofweek: 2,
			open: "14:30",
			close: "16:30",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "12:30",
		},
		{
			dayofweek: 3,
			open: "14:30",
			close: "16:30",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "12:30",
		},
		{
			dayofweek: 4,
			open: "14:30",
			close: "16:30",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "12:30",
		},
		{
			dayofweek: 5,
			open: "14:30",
			close: "16:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Eve OBS",
		},
		{
			date: "2018-03-01",
			name: "Makha Bucha Day*",
		},
		{
			date: "2018-04-06",
			name: "Shakri Day",
		},
		{
			date: "2018-04-13",
			name: "Songkran Festival 1",
		},
		{
			date: "2018-04-16",
			name: "Songkran Festival 3 OBS",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-29",
			name: "Vishaka Bucha Day*",
		},
		{
			date: "2018-07-27",
			name: "Asarnha Bucha Day",
		},
		{
			date: "2018-07-30",
			name: "King's Birthday OBS",
		},
		{
			date: "2018-08-13",
			name: "Queen's Birthday OBS",
		},
		{
			date: "2018-10-15",
			name: "King Bhumibol Adulyadej Memorial Day OBS",
		},
		{
			date: "2018-10-23",
			name: "King Chulalongkorn Memorial Day",
		},
		{
			date: "2018-12-05",
			name: "King Rama IX's Birthday",
		},
		{
			date: "2018-12-10",
			name: "Constitution Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-19",
			name: "Makha Bucha Day*",
		},
		{
			date: "2019-04-08",
			name: "Shakri Day OBS",
		},
		{
			date: "2019-04-15",
			name: "Songkran Festival 3",
		},
		{
			date: "2019-04-16",
			name: "Songkran Festival 2 OBS",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-20",
			name: "Vishaka Bucha Day*",
		},
		{
			date: "2019-07-16",
			name: "Asarnha Bucha Day",
		},
		{
			date: "2019-07-29",
			name: "King's Birthday OBS",
		},
		{
			date: "2019-08-12",
			name: "Queen's Birthday",
		},
		{
			date: "2019-10-14",
			name: "King Bhumibol Adulyadej Memorial Day OBS",
		},
		{
			date: "2019-10-23",
			name: "King Chulalongkorn Memorial Day",
		},
		{
			date: "2019-12-05",
			name: "King Rama IX's Birthday",
		},
		{
			date: "2019-12-10",
			name: "Constitution Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-10",
			name: "Makha Bucha Day*",
		},
		{
			date: "2020-04-06",
			name: "Shakri Day",
		},
		{
			date: "2020-04-13",
			name: "Songkran Festival 1",
		},
		{
			date: "2020-04-14",
			name: "Songkran Festival 2",
		},
		{
			date: "2020-04-15",
			name: "Songkran Festival 3",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-07",
			name: "Vishaka Bucha Day*",
		},
		{
			date: "2020-07-28",
			name: "King's Birthday",
		},
		{
			date: "2020-08-03",
			name: "Asarnha Bucha Day",
		},
		{
			date: "2020-08-12",
			name: "Queen's Birthday",
		},
		{
			date: "2020-10-13",
			name: "King Bhumibol Adulyadej Memorial Day",
		},
		{
			date: "2020-10-23",
			name: "King Chulalongkorn Memorial Day",
		},
		{
			date: "2020-12-07",
			name: "King Rama IX's Birthday OBS",
		},
		{
			date: "2020-12-10",
			name: "Constitution Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Thailand Stock Exchange",
	hour_aligned: false,
};

CIQ.Market.XBIL = {
	market_tz: "Europe/Madrid",
	name: "Bilbao Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "13:55",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "13:55",
		},
	],
};

CIQ.Market.XBLB = {
	market_tz: "Europe/Sarajevo",
	name: "Banja Luka Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "13:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "13:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "13:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "13:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday 2",
		},
		{
			date: "2018-01-09",
			name: "Republic Day",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-09",
			name: "Day of Victory over Fascism",
		},
		{
			date: "2018-11-21",
			name: "Signing of Peace Agreement",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday 2",
		},
		{
			date: "2019-01-07",
			name: "Orthodox Christmas OBS",
		},
		{
			date: "2019-01-09",
			name: "Republic Day",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2019-05-09",
			name: "Day of Victory over Fascism",
		},
		{
			date: "2019-11-21",
			name: "Signing of Peace Agreement",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday 2",
		},
		{
			date: "2020-01-06",
			name: "Orthodox Christmas",
		},
		{
			date: "2020-01-09",
			name: "Republic Day",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
	],
};

CIQ.Market.XBEL = {
	market_tz: "Europe/Belgrade",
	name: "Belgrade Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:25",
			close: "14:00",
		},
		{
			dayofweek: 2,
			open: "09:25",
			close: "14:00",
		},
		{
			dayofweek: 3,
			open: "09:25",
			close: "14:00",
		},
		{
			dayofweek: 4,
			open: "09:25",
			close: "14:00",
		},
		{
			dayofweek: 5,
			open: "09:25",
			close: "14:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-02-15",
			name: "Serbian National Day",
		},
		{
			date: "2018-02-16",
			name: "Serbian National Day Holiday",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-11-12",
			name: "Armistice Day OBS",
		},
		{
			date: "2018-12-31",
			name: "Trading Holiday 1",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-07",
			name: "Christmas Holiday",
		},
		{
			date: "2019-02-15",
			name: "Serbian National Day",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2019-11-11",
			name: "Armistice Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-07",
			name: "Christmas Holiday",
		},
		{
			date: "2020-02-17",
			name: "Serbian National Day Holiday OBS",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-11-11",
			name: "Armistice Day",
		},
	],
};

CIQ.Market.XBOG = {
	market_tz: "America/Bogota",
	name: "Colombia Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-08",
			name: "Epiphany OBS",
		},
		{
			date: "2018-03-19",
			name: "St. Joseph's Day",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-14",
			name: "Ascension",
		},
		{
			date: "2018-06-04",
			name: "Corpus Christi",
		},
		{
			date: "2018-06-11",
			name: "Sacred Heart",
		},
		{
			date: "2018-07-02",
			name: "Sts. Peter and Paul OBS",
		},
		{
			date: "2018-07-20",
			name: "Colombian Independence Day",
		},
		{
			date: "2018-08-07",
			name: "Battle of Boyaca",
		},
		{
			date: "2018-08-20",
			name: "Assumption Day OBS",
		},
		{
			date: "2018-10-15",
			name: "Race Day OBS",
		},
		{
			date: "2018-11-05",
			name: "All Saints' Day OBS",
		},
		{
			date: "2018-11-12",
			name: "Independence of Cartagena OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2018-12-31",
			name: "Last business day of year",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-07",
			name: "Epiphany OBS",
		},
		{
			date: "2019-03-25",
			name: "St. Joseph's Day OBS",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-03",
			name: "Ascension",
		},
		{
			date: "2019-06-24",
			name: "Corpus Christi",
		},
		{
			date: "2019-07-01",
			name: "Sacred Heart",
		},
		{
			date: "2019-07-01",
			name: "Sts. Peter and Paul OBS",
		},
		{
			date: "2019-08-07",
			name: "Battle of Boyaca",
		},
		{
			date: "2019-08-19",
			name: "Assumption Day OBS",
		},
		{
			date: "2019-10-14",
			name: "Race Day OBS",
		},
		{
			date: "2019-11-04",
			name: "All Saints' Day OBS",
		},
		{
			date: "2019-11-11",
			name: "Independence of Cartagena",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2019-12-31",
			name: "Last business day of year",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-06",
			name: "Epiphany",
		},
		{
			date: "2020-03-23",
			name: "St. Joseph's Day OBS",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-25",
			name: "Ascension",
		},
		{
			date: "2020-06-15",
			name: "Corpus Christi",
		},
		{
			date: "2020-06-22",
			name: "Sacred Heart",
		},
		{
			date: "2020-06-29",
			name: "Sts. Peter and Paul",
		},
		{
			date: "2020-07-20",
			name: "Colombian Independence Day",
		},
		{
			date: "2020-08-07",
			name: "Battle of Boyaca",
		},
		{
			date: "2020-08-17",
			name: "Assumption Day OBS",
		},
		{
			date: "2020-10-12",
			name: "Race Day",
		},
		{
			date: "2020-11-02",
			name: "All Saints' Day OBS",
		},
		{
			date: "2020-11-16",
			name: "Independence of Cartagena OBS",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2020-12-31",
			name: "Last business day of year",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "12:55",
		},
	],
};

CIQ.Market.XBNV = {
	market_tz: "America/Costa_Rica",
	name: "Costa Rica Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-11",
			name: "Juan Santamaria",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-08",
			name: "Election Day",
		},
		{
			date: "2018-07-25",
			name: "Anniversary of Annexation of Guanacaste",
		},
		{
			date: "2018-08-02",
			name: "Our Lady of Los Angeles",
		},
		{
			date: "2018-08-15",
			name: "Assumption/Mother's Day",
		},
		{
			date: "2018-10-15",
			name: "Cultures Day OBS",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-11",
			name: "Juan Santamaria",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-07-25",
			name: "Anniversary of Annexation of Guanacaste",
		},
		{
			date: "2019-08-02",
			name: "Our Lady of Los Angeles",
		},
		{
			date: "2019-08-15",
			name: "Assumption/Mother's Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-09-15",
			name: "Independence Day",
		},
		{
			date: "2020-10-12",
			name: "Cultures Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market["XBOM-CRD"] = {
	market_tz: "Asia/Kolkata",
	name: "Bombay Stock Exchange Currency Derivatives",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 2,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 3,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 4,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 5,
			open: "09:08",
			close: "15:40",
		},
		{
			date: "2018-01-26",
			name: "Republic Day",
		},
		{
			date: "2018-02-13",
			name: "Mahashivratri*",
		},
		{
			date: "2018-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2018-03-02",
			name: "Holi (2nd day)*",
		},
		{
			date: "2018-03-29",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Half-yearly Closing (April 1) OBS",
		},
		{
			date: "2018-04-30",
			name: "Buddha Pournima",
		},
		{
			date: "2018-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2018-08-15",
			name: "Independence Day",
		},
		{
			date: "2018-08-17",
			name: "Parsi New Year*",
		},
		{
			date: "2018-08-22",
			name: "Bakri-id*",
		},
		{
			date: "2018-09-13",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2018-09-20",
			name: "Moharrum*",
		},
		{
			date: "2018-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2018-10-18",
			name: "Dasara*",
		},
		{
			date: "2018-11-07",
			name: "Diwali Amavasya (Muhurat trading)*",
		},
		{
			date: "2018-11-08",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2018-11-21",
			name: "Id-e-milad*",
		},
		{
			date: "2018-11-23",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2019-03-04",
			name: "Mahashivratri*",
		},
		{
			date: "2019-03-21",
			name: "Holi (2nd day)*",
		},
		{
			date: "2019-04-01",
			name: "Half-yearly Closing (April 1)",
		},
		{
			date: "2019-04-17",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2019-06-05",
			name: "Ramzan-id (Id-ul-fitar)*",
		},
		{
			date: "2019-08-12",
			name: "Bakri-id*",
		},
		{
			date: "2019-08-15",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2019-09-10",
			name: "Moharrum*",
		},
		{
			date: "2019-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2019-10-08",
			name: "Dasara*",
		},
		{
			date: "2019-10-28",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2019-11-12",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2020-02-21",
			name: "Mahashivratri*",
		},
		{
			date: "2020-03-09",
			name: "Holi (2nd day)*",
		},
		{
			date: "2020-03-25",
			name: "Gudhi Padwa*",
		},
		{
			date: "2020-04-01",
			name: "Half-yearly Closing (April 1)",
		},
		{
			date: "2020-04-02",
			name: "Ram Navmi*",
		},
		{
			date: "2020-04-06",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-14",
			name: "Dr. Babsaheb Ambedkar Jayanti",
		},
		{
			date: "2020-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2020-05-07",
			name: "Buddha Pournima",
		},
		{
			date: "2020-07-31",
			name: "Bakri-id*",
		},
		{
			date: "2020-08-17",
			name: "Parsi New Year*",
		},
		{
			date: "2020-08-20",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2020-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2020-10-29",
			name: "Id-e-milad*",
		},
		{
			date: "2020-11-16",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XBRM = {
	market_tz: "Europe/Bucharest",
	name: "Romanian Commodities Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "17:50",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "17:50",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "17:50",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "17:50",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "17:50",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-28",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2018-06-01",
			name: "Children's Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-17",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Children's Day",
		},
		{
			date: "2020-06-08",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2020-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2020-12-01",
			name: "National Holiday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XBOM = {
	market_tz: "Asia/Kolkata",
	name: "Bombay Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 2,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 3,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 4,
			open: "09:08",
			close: "15:40",
		},
		{
			dayofweek: 5,
			open: "09:08",
			close: "15:40",
		},
		{
			date: "2018-01-26",
			name: "Republic Day",
		},
		{
			date: "2018-02-13",
			name: "Mahashivratri*",
		},
		{
			date: "2018-03-02",
			name: "Holi (2nd day)*",
		},
		{
			date: "2018-03-29",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2018-08-15",
			name: "Independence Day",
		},
		{
			date: "2018-08-22",
			name: "Bakri-id*",
		},
		{
			date: "2018-09-13",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2018-09-20",
			name: "Moharrum*",
		},
		{
			date: "2018-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2018-10-18",
			name: "Dasara*",
		},
		{
			date: "2018-11-07",
			name: "Diwali Amavasya (Muhurat trading)*",
		},
		{
			date: "2018-11-08",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2018-11-23",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-03-04",
			name: "Mahashivratri*",
		},
		{
			date: "2019-03-21",
			name: "Holi (2nd day)*",
		},
		{
			date: "2019-04-17",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2019-06-05",
			name: "Ramzan-id (Id-ul-fitar)*",
		},
		{
			date: "2019-08-12",
			name: "Bakri-id*",
		},
		{
			date: "2019-08-15",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2019-09-10",
			name: "Moharrum*",
		},
		{
			date: "2019-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2019-10-08",
			name: "Dasara*",
		},
		{
			date: "2019-10-28",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2019-11-12",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-02-21",
			name: "Mahashivratri*",
		},
		{
			date: "2020-03-09",
			name: "Holi (2nd day)*",
		},
		{
			date: "2020-04-02",
			name: "Ram Navmi*",
		},
		{
			date: "2020-04-06",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-14",
			name: "Dr. Babsaheb Ambedkar Jayanti",
		},
		{
			date: "2020-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2020-07-31",
			name: "Bakri-id*",
		},
		{
			date: "2020-08-20",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2020-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2020-11-16",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XBAR = {
	market_tz: "Europe/Madrid",
	name: "Barcelona Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "13:55",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "13:55",
		},
	],
};

CIQ.Market.XBSD = {
	market_tz: "Europe/Bucharest",
	name: "Bucharest Derivatives Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "13:15",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "13:15",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "13:15",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "13:15",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "13:15",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-28",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2018-06-01",
			name: "Children's Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-17",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Children's Day",
		},
		{
			date: "2020-06-08",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2020-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2020-12-01",
			name: "National Holiday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XBUE = {
	market_tz: "America/Argentina/Buenos_Aires",
	name: "Buenos Aires Bolsa de Comercio",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "11:00",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-12",
			name: "Carnival Monday",
		},
		{
			date: "2018-02-13",
			name: "Carnival Tuesday",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2018-04-30",
			name: "Bridge Holiday 1",
		},
		{
			date: "2018-05-01",
			name: "Workers' Day",
		},
		{
			date: "2018-05-25",
			name: "National Holiday",
		},
		{
			date: "2018-06-20",
			name: "Flag Day",
		},
		{
			date: "2018-07-09",
			name: "Independence Day",
		},
		{
			date: "2018-08-20",
			name: "Anniversary of the Death of General San Martin OBS",
		},
		{
			date: "2018-10-15",
			name: "Day of Respect for Cultural Diversity OBS",
		},
		{
			date: "2018-11-19",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2018-11-30",
			name: "G20 Summit Holiday",
		},
		{
			date: "2018-12-24",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-04",
			name: "Carnival Monday",
		},
		{
			date: "2019-03-05",
			name: "Carnival Tuesday",
		},
		{
			date: "2019-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Workers' Day",
		},
		{
			date: "2019-06-17",
			name: "Martin Miguel de Guemes Day",
		},
		{
			date: "2019-06-20",
			name: "Flag Day",
		},
		{
			date: "2019-07-08",
			name: "Bridge Holiday 1",
		},
		{
			date: "2019-07-09",
			name: "Independence Day",
		},
		{
			date: "2019-08-19",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-10-14",
			name: "Bridge Holiday 3",
		},
		{
			date: "2019-11-18",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-24",
			name: "Carnival Monday",
		},
		{
			date: "2020-02-25",
			name: "Carnival Tuesday",
		},
		{
			date: "2020-03-24",
			name: "Truth and Justice Day",
		},
		{
			date: "2020-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Workers' Day",
		},
		{
			date: "2020-05-25",
			name: "National Holiday",
		},
		{
			date: "2020-06-15",
			name: "Martin Miguel de Guemes Day OBS",
		},
		{
			date: "2020-07-09",
			name: "Independence Day",
		},
		{
			date: "2020-08-17",
			name: "Anniversary of the Death of General San Martin",
		},
		{
			date: "2020-10-12",
			name: "Day of Respect for Cultural Diversity",
		},
		{
			date: "2020-11-23",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XBSE = {
	market_tz: "Europe/Bucharest",
	name: "Bucharest Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "17:45",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "17:45",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "17:45",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "17:45",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "17:45",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2018-04-06",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-28",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2018-06-01",
			name: "Children's Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2019-04-26",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-17",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-24",
			name: "Anniversary of Romanian Principalities Union",
		},
		{
			date: "2020-04-17",
			name: "Good Friday (Orthodox)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Orthodox)",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Children's Day",
		},
		{
			date: "2020-06-08",
			name: "Pentecost Monday (Orthodox)",
		},
		{
			date: "2020-11-30",
			name: "St. Andrew's Day",
		},
		{
			date: "2020-12-01",
			name: "National Holiday",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XCAS = {
	market_tz: "Africa/Casablanca",
	name: "Casablanca Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "15:40",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "15:40",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "15:40",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "15:40",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "15:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-11",
			name: "National Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-15",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2018-07-30",
			name: "Feast of the Throne",
		},
		{
			date: "2018-08-14",
			name: "Oued Eddahab",
		},
		{
			date: "2018-08-20",
			name: "Revolution of King and People",
		},
		{
			date: "2018-08-21",
			name: "Youth Day",
		},
		{
			date: "2018-08-22",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2018-08-23",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2018-09-11",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2018-11-06",
			name: "Green March Day",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday 1*",
		},
		{
			date: "2018-11-21",
			name: "Prophet's Birthday 2*",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-11",
			name: "National Holiday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-05",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2019-06-06",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2019-07-30",
			name: "Feast of the Throne",
		},
		{
			date: "2019-08-12",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2019-08-13",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2019-08-14",
			name: "Oued Eddahab",
		},
		{
			date: "2019-08-20",
			name: "Revolution of King and People",
		},
		{
			date: "2019-08-21",
			name: "Youth Day",
		},
		{
			date: "2019-11-06",
			name: "Green March Day",
		},
		{
			date: "2019-11-11",
			name: "Prophet's Birthday 2*",
		},
		{
			date: "2019-11-18",
			name: "Independence Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-25",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2020-07-30",
			name: "Feast of the Throne",
		},
		{
			date: "2020-07-31",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2020-08-14",
			name: "Oued Eddahab",
		},
		{
			date: "2020-08-20",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2020-08-20",
			name: "Revolution of King and People",
		},
		{
			date: "2020-08-21",
			name: "Youth Day",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday 1*",
		},
		{
			date: "2020-10-30",
			name: "Prophet's Birthday 2*",
		},
		{
			date: "2020-11-06",
			name: "Green March Day",
		},
		{
			date: "2020-11-18",
			name: "Independence Day",
		},
	],
};

CIQ.Market.XCHG = {
	market_tz: "Asia/Dhaka",
	name: "Chittagong Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:25",
			close: "14:40",
		},
		{
			dayofweek: 2,
			open: "10:25",
			close: "14:40",
		},
		{
			dayofweek: 3,
			open: "10:25",
			close: "14:40",
		},
		{
			dayofweek: 4,
			open: "10:25",
			close: "14:40",
		},
		{
			dayofweek: 5,
			open: "10:25",
			close: "14:40",
		},
		{
			date: "2018-02-21",
			name: "Shahid/Martyrs Day",
		},
		{
			date: "2018-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2018-04-29",
			name: "Buddha Purnima*",
		},
		{
			date: "2018-05-01",
			name: "May Day",
		},
		{
			date: "2018-05-02",
			name: "Shab-e-Barat*",
		},
		{
			date: "2018-06-13",
			name: "Shab-e-Qadar*",
		},
		{
			date: "2018-06-14",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2018-06-17",
			name: "Eid-ul Fitr 3*",
		},
		{
			date: "2018-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2018-08-15",
			name: "National Mourning Day",
		},
		{
			date: "2018-08-21",
			name: "Eid-ul Azha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid-ul Azha 2*",
		},
		{
			date: "2018-08-23",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2018-09-02",
			name: "Janmastami*",
		},
		{
			date: "2018-11-21",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2018-12-16",
			name: "Victory Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-30",
			name: "Election Day",
		},
		{
			date: "2018-12-31",
			name: "Year-end Bank Holiday",
		},
		{
			date: "2019-02-21",
			name: "Shahid/Martyrs Day",
		},
		{
			date: "2019-03-17",
			name: "Birthday of Father of the Nation",
		},
		{
			date: "2019-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2019-04-14",
			name: "Bengali New Year",
		},
		{
			date: "2019-04-21",
			name: "Shab-e-Barat*",
		},
		{
			date: "2019-05-01",
			name: "May Day",
		},
		{
			date: "2019-06-02",
			name: "Shab-e-Qadar*",
		},
		{
			date: "2019-06-04",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2019-06-05",
			name: "Eid-ul Fitr 2*",
		},
		{
			date: "2019-06-06",
			name: "Eid-ul Fitr 3*",
		},
		{
			date: "2019-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2019-08-11",
			name: "Eid-ul Azha 1*",
		},
		{
			date: "2019-08-12",
			name: "Eid-ul Azha 2*",
		},
		{
			date: "2019-08-13",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2019-08-15",
			name: "National Mourning Day",
		},
		{
			date: "2019-09-10",
			name: "Ashura (Muharram)*",
		},
		{
			date: "2019-10-08",
			name: "Durga Puja*",
		},
		{
			date: "2019-11-10",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2019-12-16",
			name: "Victory Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "Year-end Bank Holiday",
		},
		{
			date: "2020-03-17",
			name: "Birthday of Father of the Nation",
		},
		{
			date: "2020-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2020-04-14",
			name: "Bengali New Year",
		},
		{
			date: "2020-05-07",
			name: "Buddha Purnima*",
		},
		{
			date: "2020-05-24",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2020-05-25",
			name: "Eid-ul Fitr 2*",
		},
		{
			date: "2020-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2020-08-02",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2020-10-29",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2020-12-16",
			name: "Victory Day",
		},
		{
			date: "2020-12-31",
			name: "Year-end Bank Holiday",
		},
	],
};

CIQ.Market.XBRU = {
	market_tz: "Europe/Brussels",
	name: "Euronext Brussels",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "14:00",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XCHI = {
	market_tz: "America/Chicago",
	name: "NYSE Chicago (formerly Chicago Stock Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-11-29",
			open: "08:30",
			close: "12:00",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:00",
		},
	],
};

CIQ.Market.XCAI = {
	market_tz: "Africa/Cairo",
	name: "Egyptian Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:50",
			close: "14:30",
		},
		{
			dayofweek: 2,
			open: "09:50",
			close: "14:30",
		},
		{
			dayofweek: 3,
			open: "09:50",
			close: "14:30",
		},
		{
			dayofweek: 4,
			open: "09:50",
			close: "14:30",
		},
		{
			dayofweek: 5,
			open: "09:50",
			close: "14:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-07",
			name: "Christmas (Eastern)",
		},
		{
			date: "2018-01-25",
			name: "Police Day",
		},
		{
			date: "2018-04-08",
			name: "Easter Sunday (Coptic)",
		},
		{
			date: "2018-04-09",
			name: "Easter Monday (Coptic)",
		},
		{
			date: "2018-04-25",
			name: "Sinai Liberation Day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-17",
			name: "Eid al-Fitr 3*",
		},
		{
			date: "2018-06-18",
			name: "Eid al-Fitr 4*",
		},
		{
			date: "2018-07-01",
			name: "Bank Holiday",
		},
		{
			date: "2018-07-23",
			name: "Revolution Day",
		},
		{
			date: "2018-08-20",
			name: "Wakfet Arafat*",
		},
		{
			date: "2018-08-21",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2018-08-23",
			name: "Eid al-Adha 3*",
		},
		{
			date: "2018-09-11",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2018-10-07",
			name: "Armed Forces Day",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-07",
			name: "Christmas (Eastern)",
		},
		{
			date: "2019-01-24",
			name: "Police Day",
		},
		{
			date: "2019-04-25",
			name: "Sinai Liberation Day",
		},
		{
			date: "2019-04-28",
			name: "Easter Sunday (Coptic)",
		},
		{
			date: "2019-04-29",
			name: "Easter Monday (Coptic)",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-04",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2019-06-05",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2019-07-01",
			name: "Bank Holiday",
		},
		{
			date: "2019-07-23",
			name: "Revolution Day",
		},
		{
			date: "2019-08-11",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2019-08-12",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2019-10-06",
			name: "Armed Forces Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-07",
			name: "Christmas (Eastern)",
		},
		{
			date: "2020-04-19",
			name: "Easter Sunday (Coptic)",
		},
		{
			date: "2020-04-20",
			name: "Easter Monday (Coptic)",
		},
		{
			date: "2020-05-24",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2020-05-25",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2020-07-01",
			name: "Bank Holiday",
		},
		{
			date: "2020-07-23",
			name: "Revolution Day",
		},
		{
			date: "2020-07-30",
			name: "Wakfet Arafat*",
		},
		{
			date: "2020-08-20",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2020-10-06",
			name: "Armed Forces Day",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
	],
};

CIQ.Market.XDHA = {
	market_tz: "Asia/Dhaka",
	name: "Dhaka Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:30",
			close: "14:30",
		},
		{
			dayofweek: 2,
			open: "10:30",
			close: "14:30",
		},
		{
			dayofweek: 3,
			open: "10:30",
			close: "14:30",
		},
		{
			dayofweek: 4,
			open: "10:30",
			close: "14:30",
		},
		{
			dayofweek: 5,
			open: "10:30",
			close: "14:30",
		},
		{
			date: "2018-02-21",
			name: "Shahid/Martyrs Day",
		},
		{
			date: "2018-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2018-04-29",
			name: "Buddha Purnima*",
		},
		{
			date: "2018-05-01",
			name: "May Day",
		},
		{
			date: "2018-05-02",
			name: "Shab-e-Barat*",
		},
		{
			date: "2018-06-13",
			name: "Shab-e-Qadar*",
		},
		{
			date: "2018-06-14",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2018-06-17",
			name: "Eid-ul Fitr 3*",
		},
		{
			date: "2018-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2018-08-15",
			name: "National Mourning Day",
		},
		{
			date: "2018-08-21",
			name: "Eid-ul Azha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid-ul Azha 2*",
		},
		{
			date: "2018-08-23",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2018-09-02",
			name: "Janmastami*",
		},
		{
			date: "2018-11-21",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2018-12-16",
			name: "Victory Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-30",
			name: "Election Day",
		},
		{
			date: "2018-12-31",
			name: "Year-end Bank Holiday",
		},
		{
			date: "2019-02-21",
			name: "Shahid/Martyrs Day",
		},
		{
			date: "2019-03-17",
			name: "Birthday of Father of the Nation",
		},
		{
			date: "2019-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2019-04-14",
			name: "Bengali New Year",
		},
		{
			date: "2019-04-21",
			name: "Shab-e-Barat*",
		},
		{
			date: "2019-05-01",
			name: "May Day",
		},
		{
			date: "2019-06-02",
			name: "Shab-e-Qadar*",
		},
		{
			date: "2019-06-04",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2019-06-05",
			name: "Eid-ul Fitr 2*",
		},
		{
			date: "2019-06-06",
			name: "Eid-ul Fitr 3*",
		},
		{
			date: "2019-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2019-08-11",
			name: "Eid-ul Azha 1*",
		},
		{
			date: "2019-08-12",
			name: "Eid-ul Azha 2*",
		},
		{
			date: "2019-08-13",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2019-08-15",
			name: "National Mourning Day",
		},
		{
			date: "2019-09-10",
			name: "Ashura (Muharram)*",
		},
		{
			date: "2019-10-08",
			name: "Durga Puja*",
		},
		{
			date: "2019-11-10",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2019-12-16",
			name: "Victory Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "Year-end Bank Holiday",
		},
		{
			date: "2020-03-17",
			name: "Birthday of Father of the Nation",
		},
		{
			date: "2020-03-26",
			name: "Independence/National Day",
		},
		{
			date: "2020-04-14",
			name: "Bengali New Year",
		},
		{
			date: "2020-05-07",
			name: "Buddha Purnima*",
		},
		{
			date: "2020-05-24",
			name: "Eid-ul -Fitr 1*",
		},
		{
			date: "2020-05-25",
			name: "Eid-ul Fitr 2*",
		},
		{
			date: "2020-07-01",
			name: "Mid-year Bank Holiday",
		},
		{
			date: "2020-08-02",
			name: "Eid-ul Azha 3*",
		},
		{
			date: "2020-10-29",
			name: "Eid-e-Milad-un-Nabi*",
		},
		{
			date: "2020-12-16",
			name: "Victory Day",
		},
		{
			date: "2020-12-31",
			name: "Year-end Bank Holiday",
		},
	],
};

CIQ.Market.XDUB = {
	market_tz: "Europe/Dublin",
	name: "Euronext Dublin (formerly Irish Stock Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "16:40",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "16:40",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "16:40",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "16:40",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "16:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-02",
			name: "Trading Closure",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-07",
			name: "May Bank Holiday",
		},
		{
			date: "2018-06-04",
			name: "June Bank Holiday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "St. Stephen's Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:00",
			close: "13:00",
		},
		{
			date: "2019-12-31",
			open: "08:00",
			close: "13:00",
		},
	],
};

CIQ.Marketp["XEUE-AMS"] = {
	market_tz: "Europe/Amsterdam",
	name: "Euronext Amsterdam Equity and Index Derivatives",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XETR = {
	market_tz: "Europe/Berlin",
	name: "XETRA",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:50",
			close: "17:35",
		},
		{
			dayofweek: 2,
			open: "08:50",
			close: "17:35",
		},
		{
			dayofweek: 3,
			open: "08:50",
			close: "17:35",
		},
		{
			dayofweek: 4,
			open: "08:50",
			close: "17:35",
		},
		{
			dayofweek: 5,
			open: "08:50",
			close: "17:35",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "09:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XDUS = {
	market_tz: "Europe/Berlin",
	name: "Dusseldorf Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XFKA = {
	market_tz: "Asia/Tokyo",
	name: "Fukuoka Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "15:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XEUR = {
	market_tz: "Europe/Berlin",
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Eurex (All Products ex. German and Swiss)",
	hour_aligned: false,
};

CIQ.Market.XFRA = {
	market_tz: "Europe/Berlin",
	name: "German Deutscheboerse",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XCSE = {
	market_tz: "Europe/Copenhagen",
	name: "OMX Nordic Exchange Copenhagen",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "16:55",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "16:55",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "16:55",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "16:55",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "16:55",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-27",
			name: "General Prayer Day",
		},
		{
			date: "2018-05-10",
			name: "Ascension Day",
		},
		{
			date: "2018-05-11",
			name: "Day After Ascension",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-06-05",
			name: "Constitution Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-17",
			name: "General Prayer Day",
		},
		{
			date: "2019-05-30",
			name: "Ascension Day",
		},
		{
			date: "2019-05-31",
			name: "Day After Ascension",
		},
		{
			date: "2019-06-05",
			name: "Constitution Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-08",
			name: "General Prayer Day",
		},
		{
			date: "2020-05-21",
			name: "Ascension Day",
		},
		{
			date: "2020-05-22",
			name: "Day After Ascension",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-06-05",
			name: "Constitution Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XGRM = {
	market_tz: "Europe/Berlin",
	name: "Tradegate Exchange - Regular Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "22:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-05-30",
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2019-06-10",
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2019-10-03",
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XHEL = {
	market_tz: "Europe/Helsinki",
	name: "OMX Nordic Exchange Helsinki",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "18:25",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "18:25",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "18:25",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "18:25",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "18:25",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-10",
			name: "Ascension Day",
		},
		{
			date: "2018-06-22",
			name: "Midsummer Eve OBS",
		},
		{
			date: "2018-12-06",
			name: "Independence Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-30",
			name: "Ascension Day",
		},
		{
			date: "2019-06-21",
			name: "Midsummer Eve OBS",
		},
		{
			date: "2019-12-06",
			name: "Independence Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-06",
			name: "Epiphany",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-21",
			name: "Ascension Day",
		},
		{
			date: "2020-06-19",
			name: "Midsummer Eve",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XHAN = {
	market_tz: "Europe/Berlin",
	name: "Hanover Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XHKF = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:15",
			close: "12:00",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:15",
			close: "12:00",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:15",
			close: "12:00",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:15",
			close: "12:00",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:15",
			close: "12:00",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
	name: "Hong Kong Futures Exchange",
	hour_aligned: false,
};

CIQ.Market.XHAM = {
	market_tz: "Europe/Berlin",
	name: "Hamburg Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XICE = {
	market_tz: "Atlantic/Reykjavik",
	name: "OMX Nordic Exchange Iceland",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "15:25",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "15:25",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "15:25",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "15:25",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "15:25",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-29",
			name: "Maundy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-19",
			name: "First Day of Summer",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-10",
			name: "Ascension Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-08-06",
			name: "Bank Holiday",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-18",
			name: "Maundy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-25",
			name: "First Day of Summer OBS",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-30",
			name: "Ascension Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-06-17",
			name: "National Day",
		},
		{
			date: "2019-08-05",
			name: "Bank Holiday",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-09",
			name: "Maundy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-23",
			name: "First Day of Summer OBS",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-21",
			name: "Ascension Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-06-17",
			name: "National Day",
		},
		{
			date: "2020-08-03",
			name: "Bank Holiday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XHKG = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "12:00",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "12:00",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "12:00",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "12:00",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "12:00",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "Chinese National Day",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
	name: "Hong Kong Stock Exchange",
	hour_aligned: false,
};

CIQ.Market["XIST-ISB"] = {
	market_tz: "Europe/Istanbul",
	name: "ISE Bonds and Bills",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "14:05",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "14:05",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "14:05",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "14:05",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "14:05",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2018-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2018-06-15",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2018-08-21",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2018-08-22",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2018-08-23",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2018-08-24",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2018-08-30",
			name: "Victory Day",
		},
		{
			date: "2018-10-29",
			name: "Republic Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2019-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2019-06-04",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2019-06-05",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2019-06-06",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2019-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2019-08-12",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2019-08-13",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2019-08-14",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2019-08-30",
			name: "Victory Day",
		},
		{
			date: "2019-10-29",
			name: "Republic Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2020-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2020-05-19",
			name: "Youth and Sports Day",
		},
		{
			date: "2020-05-25",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2020-05-26",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2020-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2020-07-31",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2020-08-03",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2020-10-29",
			name: "Republic Day",
		},
		{
			date: "2019-06-03",
			open: "09:30",
			close: "12:05",
		},
		{
			date: "2019-10-28",
			open: "10:00",
			close: "14:05",
		},
	],
};

CIQ.Market.XJAS = {
	market_tz: "Asia/Tokyo",
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "12:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "JASDAQ",
	hour_aligned: false,
};

CIQ.Market.XJSE = {
	market_tz: "Africa/Johannesburg",
	name: "Johannesburg Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 2,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 3,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 4,
			open: "08:30",
			close: "17:15",
		},
		{
			dayofweek: 5,
			open: "08:30",
			close: "17:15",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-21",
			name: "Human Rights Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2018-04-27",
			name: "Freedom Day",
		},
		{
			date: "2018-05-01",
			name: "Workers' Day",
		},
		{
			date: "2018-08-09",
			name: "National Women's Day",
		},
		{
			date: "2018-09-24",
			name: "Heritage Day",
		},
		{
			date: "2018-12-17",
			name: "Day of Reconciliation OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Day of Goodwill",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-21",
			name: "Human Rights Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2019-05-01",
			name: "Workers' Day",
		},
		{
			date: "2019-06-17",
			name: "Youth Day OBS",
		},
		{
			date: "2019-08-09",
			name: "National Women's Day",
		},
		{
			date: "2019-09-24",
			name: "Heritage Day",
		},
		{
			date: "2019-12-16",
			name: "Day of Reconciliation",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Day of Goodwill",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Family Day (Easter Monday)",
		},
		{
			date: "2020-04-27",
			name: "Freedom Day",
		},
		{
			date: "2020-05-01",
			name: "Workers' Day",
		},
		{
			date: "2020-06-16",
			name: "Youth Day",
		},
		{
			date: "2020-08-10",
			name: "National Women's Day OBS",
		},
		{
			date: "2020-09-24",
			name: "Heritage Day",
		},
		{
			date: "2020-12-16",
			name: "Day of Reconciliation",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:15",
		},
		{
			date: "2019-12-31",
			open: "08:30",
			close: "12:15",
		},
	],
};

CIQ.Market.XKAR = {
	market_tz: "America/Chicago",
	name: "Pakistan Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "00:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "00:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "00:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "00:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "00:00",
		},
		{
			date: "2018-02-05",
			name: "Kashmir Day",
		},
		{
			date: "2018-03-23",
			name: "Pakistan Day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-08",
			name: "Jummah-tul-Widah*",
		},
		{
			date: "2018-06-15",
			name: "Eid-ul-Fitr 1*",
		},
		{
			date: "2018-06-18",
			name: "Eid-ul-Fitr 4*",
		},
		{
			date: "2018-07-25",
			name: "Public Holiday",
		},
		{
			date: "2018-08-14",
			name: "Independence Day",
		},
		{
			date: "2018-08-21",
			name: "Eid-ul-Adha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid-ul-Adha 2*",
		},
		{
			date: "2018-08-23",
			name: "Eid-ul-Adha 3*",
		},
		{
			date: "2018-09-20",
			name: "Moharram (Ashura) 1*",
		},
		{
			date: "2018-09-21",
			name: "Moharram (Ashura) 2*",
		},
		{
			date: "2018-11-21",
			name: "Prophet's Birthday*",
		},
		{
			date: "2018-12-25",
			name: "Quaid-i-Azam Birthday (Christmas)",
		},
		{
			date: "2019-02-05",
			name: "Kashmir Day",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-31",
			name: "Jummah-tul-Widah*",
		},
		{
			date: "2019-06-05",
			name: "Eid-ul-Fitr 1*",
		},
		{
			date: "2019-06-06",
			name: "Eid-ul-Fitr 2*",
		},
		{
			date: "2019-06-07",
			name: "Eid-ul-Fitr 3*",
		},
		{
			date: "2019-08-12",
			name: "Eid-ul-Adha 1*",
		},
		{
			date: "2019-08-13",
			name: "Eid-ul-Adha 2*",
		},
		{
			date: "2019-08-14",
			name: "Independence Day",
		},
		{
			date: "2019-09-09",
			name: "Moharram (Ashura) 1*",
		},
		{
			date: "2019-09-10",
			name: "Moharram (Ashura) 2*",
		},
		{
			date: "2019-12-25",
			name: "Quaid-i-Azam Birthday (Christmas)",
		},
		{
			date: "2020-02-05",
			name: "Kashmir Day",
		},
		{
			date: "2020-03-23",
			name: "Pakistan Day",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-22",
			name: "Jummah-tul-Widah*",
		},
		{
			date: "2020-05-25",
			name: "Eid-ul-Fitr 2*",
		},
		{
			date: "2020-07-31",
			name: "Eid-ul-Adha 1*",
		},
		{
			date: "2020-08-14",
			name: "Independence Day",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
		{
			date: "2020-12-25",
			name: "Quaid-i-Azam Birthday (Christmas)",
		},
	],
};

CIQ.Market.XKLS = {
	market_tz: "Asia/Kuala_Lumpur",
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "12:30",
		},
		{
			dayofweek: 1,
			open: "14:30",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "12:30",
		},
		{
			dayofweek: 2,
			open: "14:30",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "12:30",
		},
		{
			dayofweek: 3,
			open: "14:30",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "12:30",
		},
		{
			dayofweek: 4,
			open: "14:30",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "12:30",
		},
		{
			dayofweek: 5,
			open: "14:30",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-31",
			name: "Thaipusam",
		},
		{
			date: "2018-02-01",
			name: "Federal Territory Day",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1*",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-09",
			name: "Public Holiday",
		},
		{
			date: "2018-05-10",
			name: "Public Holiday 2",
		},
		{
			date: "2018-05-11",
			name: "Public Holiday 3",
		},
		{
			date: "2018-05-29",
			name: "Wesak Day*",
		},
		{
			date: "2018-06-15",
			name: "Hari Raya Puasa 1*",
		},
		{
			date: "2018-08-22",
			name: "Hari Raya Haji*",
		},
		{
			date: "2018-08-31",
			name: "National Day",
		},
		{
			date: "2018-09-10",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2018-09-11",
			name: "First Day of Muharram*",
		},
		{
			date: "2018-09-17",
			name: "Malaysia Day OBS",
		},
		{
			date: "2018-11-06",
			name: "Deepavali*",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Thaipusam",
		},
		{
			date: "2019-02-01",
			name: "Federal Territory Day",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1*",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2*",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-20",
			name: "Wesak Day*",
		},
		{
			date: "2019-05-22",
			name: "Nuzul Al Quran",
		},
		{
			date: "2019-06-05",
			name: "Hari Raya Puasa 1*",
		},
		{
			date: "2019-06-06",
			name: "Hari Raya Puasa 2*",
		},
		{
			date: "2019-08-12",
			name: "Hari Raya Haji*",
		},
		{
			date: "2019-09-02",
			name: "First Day of Muharram*",
		},
		{
			date: "2019-09-09",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2019-09-16",
			name: "Malaysia Day",
		},
		{
			date: "2019-10-28",
			name: "Deepavali*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-10",
			name: "Thaipusam",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-07",
			name: "Wesak Day*",
		},
		{
			date: "2020-05-25",
			name: "Hari Raya Puasa 2*",
		},
		{
			date: "2020-07-31",
			name: "Hari Raya Haji*",
		},
		{
			date: "2020-08-20",
			name: "First Day of Muharram*",
		},
		{
			date: "2020-08-31",
			name: "National Day",
		},
		{
			date: "2020-09-09",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2020-09-16",
			name: "Malaysia Day",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
		{
			date: "2020-11-16",
			name: "Deepavali*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
	name: "Bursa Malaysia",
	hour_aligned: false,
};

CIQ.Market.XKOS = {
	market_tz: "Asia/Seoul",
	name: "KOSDAQ",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "15:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "15:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-03-01",
			name: "Independence Movement Day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-07",
			name: "Children's Day OBS",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday",
		},
		{
			date: "2018-06-06",
			name: "Memorial Day",
		},
		{
			date: "2018-06-13",
			name: "Local Elections Day",
		},
		{
			date: "2018-08-15",
			name: "Liberation Day",
		},
		{
			date: "2018-09-24",
			name: "Harvest Moon Festival Day",
		},
		{
			date: "2018-09-25",
			name: "Harvest Moon Festival Holiday",
		},
		{
			date: "2018-09-26",
			name: "Harvest Moon Festival Additional Holiday",
		},
		{
			date: "2018-10-03",
			name: "National Foundation Day",
		},
		{
			date: "2018-10-09",
			name: "Hangul Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-03-01",
			name: "Independence Movement Day",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-06-06",
			name: "Memorial Day",
		},
		{
			date: "2019-08-15",
			name: "Liberation Day",
		},
		{
			date: "2019-09-12",
			name: "Harvest Moon Festival Eve",
		},
		{
			date: "2019-09-13",
			name: "Harvest Moon Festival Day",
		},
		{
			date: "2019-10-03",
			name: "National Foundation Day",
		},
		{
			date: "2019-10-09",
			name: "Hangul Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-24",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year Additional Holiday",
		},
		{
			date: "2020-04-15",
			name: "Parliamentary Election Day",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-09-30",
			name: "Harvest Moon Festival Eve",
		},
		{
			date: "2020-10-01",
			name: "Harvest Moon Festival Day",
		},
		{
			date: "2020-10-02",
			name: "Harvest Moon Festival Holiday",
		},
		{
			date: "2020-10-09",
			name: "Hangul Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "Last Day of Year",
		},
		{
			date: "2019-01-02",
			open: "10:00",
			close: "15:30",
		},
		{
			date: "2019-11-14",
			open: "10:00",
			close: "16:30",
		},
	],
};

CIQ.Market.XIST = {
	market_tz: "Europe/Istanbul",
	name: "Istanbul Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2018-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2018-06-15",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2018-08-21",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2018-08-22",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2018-08-23",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2018-08-24",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2018-08-30",
			name: "Victory Day",
		},
		{
			date: "2018-10-29",
			name: "Republic Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2019-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2019-06-04",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2019-06-05",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2019-06-06",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2019-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2019-08-12",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2019-08-13",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2019-08-14",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2019-08-30",
			name: "Victory Day",
		},
		{
			date: "2019-10-29",
			name: "Republic Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2020-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2020-05-19",
			name: "Youth and Sports Day",
		},
		{
			date: "2020-05-25",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2020-05-26",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2020-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2020-07-31",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2020-08-03",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2020-10-29",
			name: "Republic Day",
		},
	],
};

CIQ.Market.XLOF = {
	market_tz: "Asia/Kuala_Lumpur",
	name: "Bursa Malaysia Derivatives Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-31",
			name: "Thaipusam",
		},
		{
			date: "2018-02-01",
			name: "Federal Territory Day",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1*",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-09",
			name: "Public Holiday",
		},
		{
			date: "2018-05-10",
			name: "Public Holiday 2",
		},
		{
			date: "2018-05-11",
			name: "Public Holiday 3",
		},
		{
			date: "2018-05-29",
			name: "Wesak Day*",
		},
		{
			date: "2018-06-15",
			name: "Hari Raya Puasa 1*",
		},
		{
			date: "2018-08-22",
			name: "Hari Raya Haji*",
		},
		{
			date: "2018-08-31",
			name: "National Day",
		},
		{
			date: "2018-09-10",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2018-09-11",
			name: "First Day of Muharram*",
		},
		{
			date: "2018-09-17",
			name: "Malaysia Day OBS",
		},
		{
			date: "2018-11-06",
			name: "Deepavali*",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Thaipusam",
		},
		{
			date: "2019-02-01",
			name: "Federal Territory Day",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1*",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2*",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-20",
			name: "Wesak Day*",
		},
		{
			date: "2019-05-22",
			name: "Nuzul Al Quran",
		},
		{
			date: "2019-06-05",
			name: "Hari Raya Puasa 1*",
		},
		{
			date: "2019-06-06",
			name: "Hari Raya Puasa 2*",
		},
		{
			date: "2019-08-12",
			name: "Hari Raya Haji*",
		},
		{
			date: "2019-09-02",
			name: "First Day of Muharram*",
		},
		{
			date: "2019-09-09",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2019-09-16",
			name: "Malaysia Day",
		},
		{
			date: "2019-10-28",
			name: "Deepavali*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-10",
			name: "Thaipusam",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-07",
			name: "Wesak Day*",
		},
		{
			date: "2020-05-25",
			name: "Hari Raya Puasa 2*",
		},
		{
			date: "2020-07-31",
			name: "Hari Raya Haji*",
		},
		{
			date: "2020-08-20",
			name: "First Day of Muharram*",
		},
		{
			date: "2020-08-31",
			name: "National Day",
		},
		{
			date: "2020-09-09",
			name: "Birthday of Yang DiPertuan Agong",
		},
		{
			date: "2020-09-16",
			name: "Malaysia Day",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
		{
			date: "2020-11-16",
			name: "Deepavali*",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-02-04",
			open: "09:00",
			close: "12:30",
		},
		{
			date: "2019-06-04",
			open: "09:00",
			close: "12:30",
		},
	],
};

CIQ.Market.XKUW = {
	market_tz: "Asia/Kuwait",
	name: "Kuwait Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:59",
			close: "12:40",
		},
		{
			dayofweek: 2,
			open: "08:59",
			close: "12:40",
		},
		{
			dayofweek: 3,
			open: "08:59",
			close: "12:40",
		},
		{
			dayofweek: 4,
			open: "08:59",
			close: "12:40",
		},
		{
			dayofweek: 5,
			open: "08:59",
			close: "12:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-25",
			name: "National Day",
		},
		{
			date: "2018-02-26",
			name: "Liberation Day",
		},
		{
			date: "2018-04-15",
			name: "Lailat al Miraj*",
		},
		{
			date: "2018-06-17",
			name: "Eid-al-Fitr 3*",
		},
		{
			date: "2018-06-18",
			name: "Eid-al-Fitr 4*",
		},
		{
			date: "2018-08-19",
			name: "Additional Eid Holiday",
		},
		{
			date: "2018-08-20",
			name: "Arafat Day",
		},
		{
			date: "2018-08-21",
			name: "Eid-al-Adha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid-al-Adha 2*",
		},
		{
			date: "2018-08-23",
			name: "Eid-al-Adha 3*",
		},
		{
			date: "2018-09-11",
			name: "Islamic New Year (Hijra)*",
		},
		{
			date: "2018-11-06",
			name: "Trading Suspension",
		},
		{
			date: "2018-11-14",
			name: "Bank/Market Holiday 1",
		},
		{
			date: "2018-11-15",
			name: "Bank/Market Holiday 2",
		},
		{
			date: "2018-11-22",
			name: "Prophet's Birthday*",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-25",
			name: "National Day",
		},
		{
			date: "2019-02-26",
			name: "Liberation Day",
		},
		{
			date: "2019-04-02",
			name: "Lailat al Miraj*",
		},
		{
			date: "2019-06-04",
			name: "Eid-al-Fitr 1*",
		},
		{
			date: "2019-06-05",
			name: "Eid-al-Fitr 2*",
		},
		{
			date: "2019-06-06",
			name: "Eid-al-Fitr 3*",
		},
		{
			date: "2019-08-11",
			name: "Eid-al-Adha 2*",
		},
		{
			date: "2019-08-12",
			name: "Eid-al-Adha 3*",
		},
		{
			date: "2019-08-13",
			name: "Eid-al-Adha 4*",
		},
		{
			date: "2019-09-01",
			name: "Islamic New Year (Hijra)*",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-25",
			name: "National Day",
		},
		{
			date: "2020-02-26",
			name: "Liberation Day",
		},
		{
			date: "2020-03-22",
			name: "Lailat al Miraj*",
		},
		{
			date: "2020-05-24",
			name: "Eid-al-Fitr 2*",
		},
		{
			date: "2020-05-25",
			name: "Eid-al-Fitr 3*",
		},
		{
			date: "2020-07-29",
			name: "Arafat Day",
		},
		{
			date: "2020-07-30",
			name: "Eid-al-Adha 1*",
		},
		{
			date: "2020-08-02",
			name: "Eid-al-Adha 4*",
		},
		{
			date: "2020-08-20",
			name: "Islamic New Year (Hijra)*",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
	],
};

CIQ.Market.XMEV = {
	market_tz: "America/Argentina/Buenos_Aires",
	name: "Buenos Aires Mercado de Valores",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 2,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 3,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 4,
			open: "11:00",
			close: "17:00",
		},
		{
			dayofweek: 5,
			open: "11:00",
			close: "17:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-12",
			name: "Carnival Monday",
		},
		{
			date: "2018-02-13",
			name: "Carnival Tuesday",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2018-04-30",
			name: "Bridge Holiday 1",
		},
		{
			date: "2018-05-01",
			name: "Workers' Day",
		},
		{
			date: "2018-05-25",
			name: "National Holiday",
		},
		{
			date: "2018-06-20",
			name: "Flag Day",
		},
		{
			date: "2018-07-09",
			name: "Independence Day",
		},
		{
			date: "2018-08-20",
			name: "Anniversary of the Death of General San Martin OBS",
		},
		{
			date: "2018-10-15",
			name: "Day of Respect for Cultural Diversity OBS",
		},
		{
			date: "2018-11-19",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2018-11-30",
			name: "G20 Summit Holiday",
		},
		{
			date: "2018-12-24",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-03-04",
			name: "Carnival Monday",
		},
		{
			date: "2019-03-05",
			name: "Carnival Tuesday",
		},
		{
			date: "2019-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Workers' Day",
		},
		{
			date: "2019-06-17",
			name: "Martin Miguel de Guemes Day",
		},
		{
			date: "2019-06-20",
			name: "Flag Day",
		},
		{
			date: "2019-07-08",
			name: "Bridge Holiday 1",
		},
		{
			date: "2019-07-09",
			name: "Independence Day",
		},
		{
			date: "2019-08-19",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-10-14",
			name: "Bridge Holiday 3",
		},
		{
			date: "2019-11-18",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-24",
			name: "Carnival Monday",
		},
		{
			date: "2020-02-25",
			name: "Carnival Tuesday",
		},
		{
			date: "2020-03-24",
			name: "Truth and Justice Day",
		},
		{
			date: "2020-04-02",
			name: "Malvinas Islands Memorial",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Workers' Day",
		},
		{
			date: "2020-05-25",
			name: "National Holiday",
		},
		{
			date: "2020-06-15",
			name: "Martin Miguel de Guemes Day OBS",
		},
		{
			date: "2020-07-09",
			name: "Independence Day",
		},
		{
			date: "2020-08-17",
			name: "Anniversary of the Death of General San Martin",
		},
		{
			date: "2020-10-12",
			name: "Day of Respect for Cultural Diversity",
		},
		{
			date: "2020-11-23",
			name: "National Sovereignty Day OBS",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XMAD = {
	market_tz: "Europe/Madrid",
	name: "Madrid Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "13:55",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "13:55",
		},
	],
};

CIQ.Market.XLON = {
	market_tz: "Europe/London",
	name: "London Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "07:50",
			close: "16:40",
		},
		{
			dayofweek: 2,
			open: "07:50",
			close: "16:40",
		},
		{
			dayofweek: 3,
			open: "07:50",
			close: "16:40",
		},
		{
			dayofweek: 4,
			open: "07:50",
			close: "16:40",
		},
		{
			dayofweek: 5,
			open: "07:50",
			close: "16:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-07",
			name: "Early May Bank Holiday",
		},
		{
			date: "2018-05-28",
			name: "Late May Bank Holiday",
		},
		{
			date: "2018-08-27",
			name: "Summer Bank Holiday",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-06",
			name: "Early May Bank Holiday",
		},
		{
			date: "2019-05-27",
			name: "Late May Bank Holiday",
		},
		{
			date: "2019-08-26",
			name: "Summer Bank Holiday",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-04",
			name: "Early May Bank Holiday",
		},
		{
			date: "2020-05-25",
			name: "Late May Bank Holiday",
		},
		{
			date: "2020-08-31",
			name: "Summer Bank Holiday",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2020-12-28",
			name: "Boxing Day OBS",
		},
		{
			date: "2019-12-24",
			open: "07:50",
			close: "12:40",
		},
		{
			date: "2019-12-31",
			open: "07:50",
			close: "12:40",
		},
	],
};

CIQ.Market.XMUN = {
	market_tz: "Europe/Berlin",
	name: "Munich Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "20:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "20:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XMOS = {
	market_tz: "Europe/Moscow",
	name: "Moscow Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 2,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 3,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 4,
			open: "09:50",
			close: "18:50",
		},
		{
			dayofweek: 5,
			open: "09:50",
			close: "18:50",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-01-08",
			name: "New Year's Holiday 3",
		},
		{
			date: "2018-02-23",
			name: "Defense of the Fatherland",
		},
		{
			date: "2018-03-08",
			name: "International Women's Day",
		},
		{
			date: "2018-05-01",
			name: "International Labour Day",
		},
		{
			date: "2018-05-09",
			name: "Victory Day",
		},
		{
			date: "2018-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2018-11-05",
			name: "National Unity Day OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-01-07",
			name: "Russian Orthodox Christmas",
		},
		{
			date: "2019-03-08",
			name: "International Women's Day",
		},
		{
			date: "2019-05-01",
			name: "International Labour Day",
		},
		{
			date: "2019-05-09",
			name: "Victory Day",
		},
		{
			date: "2019-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2019-11-04",
			name: "National Unity Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve Trading Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-01-07",
			name: "Russian Orthodox Christmas",
		},
		{
			date: "2020-03-09",
			name: "International Women's Day OBS",
		},
		{
			date: "2020-05-01",
			name: "International Labour Day",
		},
		{
			date: "2020-05-11",
			name: "Victory Day OBS",
		},
		{
			date: "2020-06-12",
			name: "Declaration of Russian Sovereignty",
		},
		{
			date: "2020-11-04",
			name: "National Unity Day",
		},
	],
};

CIQ.Market.XMEX = {
	market_tz: "America/Mexico_City",
	name: "Mexico Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:25",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "08:25",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "08:25",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "08:25",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "08:25",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-05",
			name: "Constitution Day",
		},
		{
			date: "2018-03-19",
			name: "Juarez's  Birthday",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-11-02",
			name: "All Souls' Day",
		},
		{
			date: "2018-11-19",
			name: "Mexican Revolution",
		},
		{
			date: "2018-12-12",
			name: "Our Lady of Guadalupe",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Constitution Day",
		},
		{
			date: "2019-03-18",
			name: "Juarez's  Birthday",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-09-16",
			name: "Independence Day",
		},
		{
			date: "2019-11-18",
			name: "Mexican Revolution",
		},
		{
			date: "2019-12-12",
			name: "Our Lady of Guadalupe",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-02-03",
			name: "Constitution Day",
		},
		{
			date: "2020-03-16",
			name: "Juarez's  Birthday",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-09-16",
			name: "Independence Day",
		},
		{
			date: "2020-11-02",
			name: "All Souls' Day",
		},
		{
			date: "2020-11-16",
			name: "Mexican Revolution",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "08:30",
			close: "12:00",
		},
	],
};

CIQ.Market.XNAI = {
	market_tz: "Africa/Nairobi",
	name: "Nairobi Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-01",
			name: "Madaraka Day",
		},
		{
			date: "2018-06-15",
			name: "Id-ul-Fitr*",
		},
		{
			date: "2018-08-21",
			name: "Idd-ul-Adha*",
		},
		{
			date: "2018-10-10",
			name: "Moi Day",
		},
		{
			date: "2018-12-12",
			name: "Jamhuri Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-05",
			name: "Id-ul-Fitr*",
		},
		{
			date: "2019-10-21",
			name: "Mashujaa Day OBS",
		},
		{
			date: "2019-12-12",
			name: "Jamhuri Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Madaraka Day",
		},
		{
			date: "2020-10-20",
			name: "Mashujaa Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XNEP = {
	market_tz: "Asia/Kathmandu",
	name: "Nepal Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "16:20",
		},
		{
			date: "2018-01-11",
			name: "Prithvi Jayanti/National Unity Day",
		},
		{
			date: "2018-01-15",
			name: "Maghi Parba",
		},
		{
			date: "2018-01-18",
			name: "Sonam Lhosar",
		},
		{
			date: "2018-01-30",
			name: "Martyr's Memorial Day*",
		},
		{
			date: "2018-02-13",
			name: "Maha Shivaratri*",
		},
		{
			date: "2018-02-16",
			name: "Gyalbo Lhochar",
		},
		{
			date: "2018-02-19",
			name: "National Democracy Day*",
		},
		{
			date: "2018-03-01",
			name: "Fagu Purnima*",
		},
		{
			date: "2018-03-08",
			name: "International Women's Day",
		},
		{
			date: "2018-03-25",
			name: "Ram Nawami*",
		},
		{
			date: "2018-04-30",
			name: "Buddha Jayanti*",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-13",
			name: "Bhoto Jatra Festival",
		},
		{
			date: "2018-08-27",
			name: "Gai Jatra",
		},
		{
			date: "2018-09-19",
			name: "Constitution Day",
		},
		{
			date: "2018-09-24",
			name: "Indra Jatra",
		},
		{
			date: "2018-10-16",
			name: "Fulpati*",
		},
		{
			date: "2018-10-17",
			name: "Maha Astami*",
		},
		{
			date: "2018-10-18",
			name: "Maha Nawami*",
		},
		{
			date: "2018-10-19",
			name: "Bijaya Dashmi*",
		},
		{
			date: "2018-11-07",
			name: "Laxmi Puja*",
		},
		{
			date: "2018-11-08",
			name: "Gobardhan Puja*",
		},
		{
			date: "2018-11-09",
			name: "Bhai Tika*",
		},
		{
			date: "2018-12-30",
			name: "Tamu Lhochhar",
		},
		{
			date: "2019-03-04",
			name: "Maha Shivaratri*",
		},
		{
			date: "2019-03-08",
			name: "International Women's Day",
		},
		{
			date: "2019-03-20",
			name: "Fagu Purnima*",
		},
		{
			date: "2019-04-05",
			name: "Ghode Jatra*",
		},
		{
			date: "2019-04-14",
			name: "Nepali New Year's Day*",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-29",
			name: "Republic Day",
		},
		{
			date: "2019-09-19",
			name: "Constitution Day",
		},
		{
			date: "2019-10-13",
			name: "Purnima*",
		},
		{
			date: "2019-12-30",
			name: "Tamu Lhochhar",
		},
		{
			date: "2020-01-15",
			name: "Maghi Parba",
		},
		{
			date: "2020-01-30",
			name: "Martyr's Memorial Day*",
		},
		{
			date: "2020-02-19",
			name: "National Democracy Day*",
		},
		{
			date: "2020-03-08",
			name: "International Women's Day",
		},
		{
			date: "2020-04-14",
			name: "Nepali New Year's Day*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-07",
			name: "Buddha Jayanti*",
		},
		{
			date: "2020-05-29",
			name: "Republic Day",
		},
		{
			date: "2020-12-30",
			name: "Tamu Lhochhar",
		},
	],
};

CIQ.Market.XNAS = {
	market_tz: "America/New_York",
	name: "NASDAQ",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.XNGO = {
	market_tz: "Asia/Tokyo",
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "12:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Nagoya Stock Exchange",
	hour_aligned: false,
};

CIQ.Market.XNSE = {
	market_tz: "Asia/Kolkata",
	name: "National Stock Exchange of India",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:08",
			close: "16:00",
		},
		{
			date: "2018-01-26",
			name: "Republic Day",
		},
		{
			date: "2018-02-13",
			name: "Mahashivratri*",
		},
		{
			date: "2018-03-02",
			name: "Holi (2nd day)*",
		},
		{
			date: "2018-03-29",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2018-08-15",
			name: "Independence Day",
		},
		{
			date: "2018-08-22",
			name: "Bakri-id*",
		},
		{
			date: "2018-09-13",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2018-09-20",
			name: "Moharrum*",
		},
		{
			date: "2018-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2018-10-18",
			name: "Dasara*",
		},
		{
			date: "2018-11-07",
			name: "Diwali Amavasya (Muhurat trading)*",
		},
		{
			date: "2018-11-08",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2018-11-23",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-03-04",
			name: "Mahashivratri*",
		},
		{
			date: "2019-03-21",
			name: "Holi (2nd day)*",
		},
		{
			date: "2019-04-17",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2019-06-05",
			name: "Ramzan-id (Id-ul-fitar)*",
		},
		{
			date: "2019-08-12",
			name: "Bakri-id*",
		},
		{
			date: "2019-08-15",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2019-09-10",
			name: "Moharrum*",
		},
		{
			date: "2019-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2019-10-08",
			name: "Dasara*",
		},
		{
			date: "2019-10-28",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2019-11-12",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-02-21",
			name: "Mahashivratri*",
		},
		{
			date: "2020-03-09",
			name: "Holi (2nd day)*",
		},
		{
			date: "2020-04-02",
			name: "Ram Navmi*",
		},
		{
			date: "2020-04-06",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-14",
			name: "Dr. Babsaheb Ambedkar Jayanti",
		},
		{
			date: "2020-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2020-07-31",
			name: "Bakri-id*",
		},
		{
			date: "2020-08-20",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2020-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2020-11-16",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XNYS = {
	market_tz: "America/New_York",
	name: "New York Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market["XNSE-CRD"] = {
	market_tz: "Asia/Kolkata",
	name: "NSEI Currency Derivatives",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:08",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:08",
			close: "16:00",
		},
		{
			date: "2018-01-26",
			name: "Republic Day",
		},
		{
			date: "2018-02-13",
			name: "Mahashivratri*",
		},
		{
			date: "2018-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2018-03-02",
			name: "Holi (2nd day)*",
		},
		{
			date: "2018-03-29",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Half-yearly Closing (April 1) OBS",
		},
		{
			date: "2018-04-30",
			name: "Buddha Pournima",
		},
		{
			date: "2018-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2018-08-15",
			name: "Independence Day",
		},
		{
			date: "2018-08-17",
			name: "Parsi New Year*",
		},
		{
			date: "2018-08-22",
			name: "Bakri-id*",
		},
		{
			date: "2018-09-13",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2018-09-20",
			name: "Moharrum*",
		},
		{
			date: "2018-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2018-10-18",
			name: "Dasara*",
		},
		{
			date: "2018-11-07",
			name: "Diwali Amavasya (Muhurat trading)*",
		},
		{
			date: "2018-11-08",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2018-11-21",
			name: "Id-e-milad*",
		},
		{
			date: "2018-11-23",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2019-03-04",
			name: "Mahashivratri*",
		},
		{
			date: "2019-03-21",
			name: "Holi (2nd day)*",
		},
		{
			date: "2019-04-01",
			name: "Half-yearly Closing (April 1)",
		},
		{
			date: "2019-04-17",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2019-06-05",
			name: "Ramzan-id (Id-ul-fitar)*",
		},
		{
			date: "2019-08-12",
			name: "Bakri-id*",
		},
		{
			date: "2019-08-15",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2019-09-10",
			name: "Moharrum*",
		},
		{
			date: "2019-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2019-10-08",
			name: "Dasara*",
		},
		{
			date: "2019-10-28",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2019-11-12",
			name: "Guru Nanak Jayanti*",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-02-19",
			name: "Chatrapati Shivaji Maharaj Jayanti",
		},
		{
			date: "2020-02-21",
			name: "Mahashivratri*",
		},
		{
			date: "2020-03-09",
			name: "Holi (2nd day)*",
		},
		{
			date: "2020-03-25",
			name: "Gudhi Padwa*",
		},
		{
			date: "2020-04-01",
			name: "Half-yearly Closing (April 1)",
		},
		{
			date: "2020-04-02",
			name: "Ram Navmi*",
		},
		{
			date: "2020-04-06",
			name: "Mahavir Jayanti*",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-14",
			name: "Dr. Babsaheb Ambedkar Jayanti",
		},
		{
			date: "2020-05-01",
			name: "Maharashtra or May Day",
		},
		{
			date: "2020-05-07",
			name: "Buddha Pournima",
		},
		{
			date: "2020-07-31",
			name: "Bakri-id*",
		},
		{
			date: "2020-08-17",
			name: "Parsi New Year*",
		},
		{
			date: "2020-08-20",
			name: "Ganesh Chaturthi*",
		},
		{
			date: "2020-10-02",
			name: "Mahatma Gandhi's Birthday",
		},
		{
			date: "2020-10-29",
			name: "Id-e-milad*",
		},
		{
			date: "2020-11-16",
			name: "Diwali (Bali Pratipada)",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XOSL = {
	market_tz: "Europe/Oslo",
	name: "Oslo Bors",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "16:20",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "16:20",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-29",
			name: "Holy Thursday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-10",
			name: "Ascension Day",
		},
		{
			date: "2018-05-17",
			name: "Constitution Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-18",
			name: "Holy Thursday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-17",
			name: "Constitution Day",
		},
		{
			date: "2019-05-30",
			name: "Ascension Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-09",
			name: "Holy Thursday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-21",
			name: "Ascension Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-04-17",
			open: "09:00",
			close: "13:05",
		},
	],
};

CIQ.Market.XGME = {
	market_tz: "Europe/Rome",
	name: "GME Italian Power Exchange MTE Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XNZE = {
	market_tz: "Pacific/Auckland",
	name: "NZX (New Zealand Stock Exchange)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "16:45",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "16:45",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "16:45",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "16:45",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "16:45",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Obs.",
		},
		{
			date: "2018-02-06",
			name: "Waitangi Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2018-06-04",
			name: "Queen's Birthday",
		},
		{
			date: "2018-10-22",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Boxing Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Obs.",
		},
		{
			date: "2019-02-06",
			name: "Waitangi Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-04-25",
			name: "ANZAC Day",
		},
		{
			date: "2019-06-03",
			name: "Queen's Birthday",
		},
		{
			date: "2019-10-28",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Boxing Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Obs.",
		},
		{
			date: "2020-02-06",
			name: "Waitangi Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-27",
			name: "ANZAC Day OBS",
		},
		{
			date: "2020-06-01",
			name: "Queen's Birthday",
		},
		{
			date: "2020-10-26",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-28",
			name: "Boxing Day OBS",
		},
		{
			date: "2019-12-24",
			open: "10:00",
			close: "13:00",
		},
		{
			date: "2019-12-31",
			open: "10:00",
			close: "13:00",
		},
	],
};

CIQ.Market.XOTC = {
	market_tz: "America/New_York",
	name: "OTC Bulletin Board",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.XMUS = {
	market_tz: "Asia/Muscat",
	name: "Muscat Securities Market",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "14:00",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "14:00",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "14:00",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "14:00",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "14:00",
		},
		{
			date: "2018-04-15",
			name: "Ascension of Prophet Muhammad*",
		},
		{
			date: "2018-06-14",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2018-06-17",
			name: "Eid al-Fitr 4*",
		},
		{
			date: "2018-06-18",
			name: "Eid al-Fitr 5*",
		},
		{
			date: "2018-07-23",
			name: "Renaissance Day",
		},
		{
			date: "2018-08-19",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2018-08-20",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2018-08-21",
			name: "Eid al-Adha 3*",
		},
		{
			date: "2018-08-22",
			name: "Eid al-Adha 4*",
		},
		{
			date: "2018-08-23",
			name: "Eid al-Adha 5*",
		},
		{
			date: "2018-09-11",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2018-11-21",
			name: "National Day",
		},
		{
			date: "2018-11-22",
			name: "National Day Holiday",
		},
		{
			date: "2019-04-03",
			name: "Ascension of Prophet Muhammad*",
		},
		{
			date: "2019-06-05",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2019-06-06",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2019-07-23",
			name: "Renaissance Day",
		},
		{
			date: "2019-08-11",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2019-08-12",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2019-08-13",
			name: "Eid al-Adha 3*",
		},
		{
			date: "2020-03-22",
			name: "Ascension of Prophet Muhammad*",
		},
		{
			date: "2020-05-24",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2020-05-25",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2020-07-23",
			name: "Renaissance Day",
		},
		{
			date: "2020-08-02",
			name: "Eid al-Adha 3*",
		},
		{
			date: "2020-08-20",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
	],
};

CIQ.Market.XPSX = {
	market_tz: "America/New_York",
	name: "NASDAQ OMX PSX",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-15",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2018-02-19",
			name: "Presidents' Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-28",
			name: "Memorial Day",
		},
		{
			date: "2018-07-04",
			name: "Independence Day",
		},
		{
			date: "2018-09-03",
			name: "Labor Day",
		},
		{
			date: "2018-11-22",
			name: "Thanksgiving",
		},
		{
			date: "2018-12-05",
			name: "National Mourning for George H.W. Bush",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-21",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2019-02-18",
			name: "Presidents' Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-27",
			name: "Memorial Day",
		},
		{
			date: "2019-07-04",
			name: "Independence Day",
		},
		{
			date: "2019-09-02",
			name: "Labor Day",
		},
		{
			date: "2019-11-28",
			name: "Thanksgiving",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-20",
			name: "Martin Luther King Jr. Day",
		},
		{
			date: "2020-02-17",
			name: "Presidents' Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-25",
			name: "Memorial Day",
		},
		{
			date: "2020-07-03",
			name: "Independence Day OBS",
		},
		{
			date: "2020-09-07",
			name: "Labor Day",
		},
		{
			date: "2020-11-26",
			name: "Thanksgiving",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
		{
			date: "2019-07-03",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-11-29",
			open: "09:30",
			close: "13:00",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "13:00",
		},
	],
};

CIQ.Market.XSAP = {
	market_tz: "Asia/Tokyo",
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "11:00",
		},
		{
			dayofweek: 1,
			open: "12:30",
			close: "15:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "11:00",
		},
		{
			dayofweek: 2,
			open: "12:30",
			close: "15:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "11:00",
		},
		{
			dayofweek: 3,
			open: "12:30",
			close: "15:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "11:00",
		},
		{
			dayofweek: 4,
			open: "12:30",
			close: "15:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "11:00",
		},
		{
			dayofweek: 5,
			open: "12:30",
			close: "15:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Sapporo Securities Exchange",
	hour_aligned: false,
};

CIQ.Market.XSEC = {
	market_tz: "Asia/Hong_Kong",
	name: "Shenzhen-HK Stock Connect (Northbound Trading)",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:20",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:20",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:20",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:20",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:20",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-03-29",
			name: "Day before HK Good Friday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "No trading 1",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-06-29",
			name: "No trading 2",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-21",
			name: "No trading 3",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-10-16",
			name: "No trading 4",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-18",
			name: "Day before HK Good Friday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-10",
			name: "Day Before Buddha's Birthday",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-06-28",
			name: "No trading 2",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-04-09",
			name: "Day before HK Good Friday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
};

CIQ.Market.XPAE = {
	market_tz: "Asia/Jerusalem",
	name: "Palestine Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "13:00",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "13:00",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "13:00",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "13:00",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "13:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-07",
			name: "Orthodox Christmas",
		},
		{
			date: "2018-01-23",
			name: "Bank and Market Closure",
		},
		{
			date: "2018-03-08",
			name: "International Women's Day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-15",
			name: "Bank and Market Closure 2",
		},
		{
			date: "2018-06-14",
			name: "Al Fiter 1*",
		},
		{
			date: "2018-06-17",
			name: "Al Fiter 4*",
		},
		{
			date: "2018-06-18",
			name: "Al Fiter 5*",
		},
		{
			date: "2018-08-20",
			name: "Al Adha 1*",
		},
		{
			date: "2018-08-21",
			name: "Al Adha 2*",
		},
		{
			date: "2018-08-22",
			name: "Al Adha 3*",
		},
		{
			date: "2018-08-23",
			name: "Al Adha 4*",
		},
		{
			date: "2018-09-11",
			name: "Hijri New Year*",
		},
		{
			date: "2018-11-15",
			name: "National Day",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-07",
			name: "Orthodox Christmas",
		},
		{
			date: "2019-04-03",
			name: "Isra'a Mera'aj Day*",
		},
		{
			date: "2019-04-28",
			name: "Easter Holiday",
		},
		{
			date: "2019-05-02",
			name: "Labour Day OBS",
		},
		{
			date: "2019-06-04",
			name: "Al Fiter 1*",
		},
		{
			date: "2019-06-05",
			name: "Al Fiter 2*",
		},
		{
			date: "2019-06-06",
			name: "Al Fiter 3*",
		},
		{
			date: "2019-08-11",
			name: "Al Adha 1*",
		},
		{
			date: "2019-08-12",
			name: "Al Adha 2*",
		},
		{
			date: "2019-08-13",
			name: "Al Adha 3*",
		},
		{
			date: "2019-08-14",
			name: "Al Adha 4*",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-07",
			name: "Orthodox Christmas",
		},
		{
			date: "2020-03-08",
			name: "International Women's Day",
		},
		{
			date: "2020-03-22",
			name: "Isra'a Mera'aj Day*",
		},
		{
			date: "2020-05-24",
			name: "Al Fiter 1*",
		},
		{
			date: "2020-05-25",
			name: "Al Fiter 2*",
		},
		{
			date: "2020-05-26",
			name: "Al Fiter 3*",
		},
		{
			date: "2020-08-02",
			name: "Al Adha 3*",
		},
		{
			date: "2020-08-03",
			name: "Al Adha 4*",
		},
		{
			date: "2020-08-20",
			name: "Hijri New Year*",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
		{
			date: "2020-11-15",
			name: "National Day",
		},
	],
};

CIQ.Market.XSGO = {
	market_tz: "America/Santiago",
	name: "Santiago Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "16:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "16:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-16",
			name: "Public Holiday 2",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2018-07-02",
			name: "Saints Peter and Paul OBS",
		},
		{
			date: "2018-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2018-08-15",
			name: "Assumption Day",
		},
		{
			date: "2018-09-17",
			name: "Public Holiday",
		},
		{
			date: "2018-09-18",
			name: "Independence Day",
		},
		{
			date: "2018-09-19",
			name: "Army Day",
		},
		{
			date: "2018-10-15",
			name: "Columbus Day OBS",
		},
		{
			date: "2018-11-01",
			name: "All Saints' Day",
		},
		{
			date: "2018-11-02",
			name: "Evangelical Church Day OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2019-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2019-08-15",
			name: "Assumption Day",
		},
		{
			date: "2019-09-18",
			name: "Independence Day",
		},
		{
			date: "2019-09-19",
			name: "Army Day",
		},
		{
			date: "2019-09-20",
			name: "Public Holiday",
		},
		{
			date: "2019-10-31",
			name: "Evangelical Church Day",
		},
		{
			date: "2019-11-01",
			name: "All Saints' Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-21",
			name: "Battle of Iquique/Navy Day",
		},
		{
			date: "2020-06-29",
			name: "Saints Peter and Paul",
		},
		{
			date: "2020-07-16",
			name: "Solemnity of Virgin of Carmen",
		},
		{
			date: "2020-09-18",
			name: "Independence Day",
		},
		{
			date: "2020-10-12",
			name: "Columbus Day",
		},
		{
			date: "2020-12-08",
			name: "Immaculate Conception",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "Bank Holiday",
		},
		{
			date: "2019-04-18",
			open: "09:30",
			close: "13:30",
		},
		{
			date: "2019-09-17",
			open: "09:30",
			close: "13:30",
		},
		{
			date: "2019-12-24",
			open: "09:30",
			close: "12:30",
		},
		{
			date: "2019-12-30",
			open: "09:30",
			close: "12:30",
		},
	],
};

CIQ.Market.XSHE = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
	],
	name: "Shenzhen Stock Exchange A-shares",
	hour_aligned: false,
};

CIQ.Market.XSGE = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 1,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 1,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 2,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 3,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 4,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "21:00",
			close: "24:00",
		},
		{
			dayofweek: 5,
			open: "00:00",
			close: "02:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "21:00",
			close: "24:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
	],
	name: "Shanghai Futures Exchange",
	hour_aligned: false,
};

CIQ.Market.XPAR = {
	market_tz: "Europe/Paris",
	name: "Euronext Paris",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "17:40",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "17:40",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-24",
			open: "09:00",
			close: "14:00",
		},
		{
			date: "2019-12-31",
			open: "09:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XSHG = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
	],
	name: "Shanghai Stock Exchange A-shares",
	hour_aligned: false,
};

CIQ.Market["XSHG-USD"] = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-05-01",
			name: "Labour Day 1",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
	],
	name: "Shanghai Stock Exchange B-shares",
	hour_aligned: false,
};

CIQ.Market.XSSE = {
	market_tz: "Europe/Sarajevo",
	name: "Sarajevo Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "13:30",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "13:30",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "13:30",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "13:30",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "13:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2018-03-01",
			name: "Independence Day",
		},
		{
			date: "2018-03-02",
			name: "Independence Day Holiday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-30",
			name: "Non-trading day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-06-15",
			name: "Bajram Ramadan",
		},
		{
			date: "2018-08-20",
			name: "Bajram Kurban Holiday",
		},
		{
			date: "2018-08-21",
			name: "Bajram Kurban",
		},
		{
			date: "2018-11-26",
			name: "Statehood Day OBS",
		},
		{
			date: "2018-12-25",
			name: "Christmas",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2019-03-01",
			name: "Independence Day",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-02",
			name: "Labour Day Holiday",
		},
		{
			date: "2019-05-03",
			name: "Non-trading day",
		},
		{
			date: "2019-06-03",
			name: "Bajram Ramadan Holiday",
		},
		{
			date: "2019-06-04",
			name: "Bajram Ramadan",
		},
		{
			date: "2019-08-12",
			name: "Bajram Kurban",
		},
		{
			date: "2019-11-25",
			name: "Statehood Day",
		},
		{
			date: "2019-12-25",
			name: "Christmas",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "New Year's Holiday",
		},
		{
			date: "2020-03-02",
			name: "Independence Day OBS",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-07-31",
			name: "Bajram Kurban",
		},
		{
			date: "2020-11-25",
			name: "Statehood Day",
		},
		{
			date: "2020-12-25",
			name: "Christmas",
		},
	],
};

CIQ.Market.XTAF = {
	market_tz: "Asia/Taipei",
	name: "Taiwan Futures Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "13:30",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "13:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-13",
			name: "LNY - No Trading 1",
		},
		{
			date: "2018-02-14",
			name: "LNY - No Trading 2",
		},
		{
			date: "2018-02-15",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Additional LNY Holiday",
		},
		{
			date: "2018-02-20",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2018-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2018-04-04",
			name: "Children's Day",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival",
		},
		{
			date: "2018-09-24",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2018-10-10",
			name: "National Day",
		},
		{
			date: "2018-12-31",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-31",
			name: "LNY - No Trading 1",
		},
		{
			date: "2019-02-01",
			name: "LNY - No Trading 2",
		},
		{
			date: "2019-02-04",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2019-03-01",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-04-04",
			name: "Children's Day",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival",
		},
		{
			date: "2019-09-13",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2019-10-10",
			name: "National Day",
		},
		{
			date: "2019-10-11",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-22",
			name: "LNY - No Trading 1",
		},
		{
			date: "2020-01-23",
			name: "LNY - No Trading 2",
		},
		{
			date: "2020-01-24",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Additional LNY Holiday",
		},
		{
			date: "2020-01-29",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2020-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2020-04-03",
			name: "Children's Day OBS",
		},
		{
			date: "2020-04-06",
			name: "Ching Ming Festival",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival",
		},
		{
			date: "2020-06-26",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2020-10-02",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-10-09",
			name: "Adjusted Holiday 3",
		},
	],
};

CIQ.Market.XTAI = {
	market_tz: "Asia/Taipei",
	name: "Taiwan Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:00",
			close: "13:25",
		},
		{
			dayofweek: 2,
			open: "09:00",
			close: "13:25",
		},
		{
			dayofweek: 3,
			open: "09:00",
			close: "13:25",
		},
		{
			dayofweek: 4,
			open: "09:00",
			close: "13:25",
		},
		{
			dayofweek: 5,
			open: "09:00",
			close: "13:25",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-13",
			name: "LNY - No Trading 1",
		},
		{
			date: "2018-02-14",
			name: "LNY - No Trading 2",
		},
		{
			date: "2018-02-15",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Additional LNY Holiday",
		},
		{
			date: "2018-02-20",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2018-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2018-04-04",
			name: "Children's Day",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival",
		},
		{
			date: "2018-09-24",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2018-10-10",
			name: "National Day",
		},
		{
			date: "2018-12-31",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-31",
			name: "LNY - No Trading 1",
		},
		{
			date: "2019-02-01",
			name: "LNY - No Trading 2",
		},
		{
			date: "2019-02-04",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2019-03-01",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2019-04-04",
			name: "Children's Day",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival",
		},
		{
			date: "2019-09-13",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2019-10-10",
			name: "National Day",
		},
		{
			date: "2019-10-11",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-22",
			name: "LNY - No Trading 1",
		},
		{
			date: "2020-01-23",
			name: "LNY - No Trading 2",
		},
		{
			date: "2020-01-24",
			name: "Lunar New Year's Eve",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Additional LNY Holiday",
		},
		{
			date: "2020-01-29",
			name: "Additional LNY Holiday 2",
		},
		{
			date: "2020-02-28",
			name: "Peace Memorial Day",
		},
		{
			date: "2020-04-03",
			name: "Children's Day OBS",
		},
		{
			date: "2020-04-06",
			name: "Ching Ming Festival",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival",
		},
		{
			date: "2020-06-26",
			name: "Adjusted Holiday 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-Autumn Festival",
		},
		{
			date: "2020-10-02",
			name: "Adjusted Holiday 2",
		},
		{
			date: "2020-10-09",
			name: "Adjusted Holiday 3",
		},
	],
};

CIQ.Market.XTK1 = {
	market_tz: "Asia/Tokyo",
	name: "Tokyo Stock Exchange ToSTNeT Trading",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:20",
			close: "17:30",
		},
		{
			dayofweek: 2,
			open: "08:20",
			close: "17:30",
		},
		{
			dayofweek: 3,
			open: "08:20",
			close: "17:30",
		},
		{
			dayofweek: 4,
			open: "08:20",
			close: "17:30",
		},
		{
			dayofweek: 5,
			open: "08:20",
			close: "17:30",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
};

CIQ.Market.XSSC = {
	market_tz: "Asia/Hong_Kong",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "13:00",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "13:00",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-15",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2018-02-16",
			name: "Lunar New Year 1",
		},
		{
			date: "2018-02-19",
			name: "Lunar New Year 4",
		},
		{
			date: "2018-02-20",
			name: "Lunar New Year 5",
		},
		{
			date: "2018-02-21",
			name: "Lunar New Year 6",
		},
		{
			date: "2018-03-29",
			name: "Day before HK Good Friday",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2018-04-06",
			name: "Ching Ming Festival Holiday",
		},
		{
			date: "2018-04-30",
			name: "Labour Day Holiday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "No trading 1",
		},
		{
			date: "2018-05-22",
			name: "Buddha's Birthday*",
		},
		{
			date: "2018-06-18",
			name: "Tuen Ng Day*",
		},
		{
			date: "2018-06-18",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2018-06-29",
			name: "No trading 2",
		},
		{
			date: "2018-07-02",
			name: "SAR Establishment Day OBS",
		},
		{
			date: "2018-09-21",
			name: "No trading 3",
		},
		{
			date: "2018-09-24",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2018-09-25",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2018-10-01",
			name: "National Day 1",
		},
		{
			date: "2018-10-02",
			name: "National Day 2",
		},
		{
			date: "2018-10-03",
			name: "National Day 3",
		},
		{
			date: "2018-10-04",
			name: "National Day 4",
		},
		{
			date: "2018-10-05",
			name: "National Day 5",
		},
		{
			date: "2018-10-16",
			name: "No trading 4",
		},
		{
			date: "2018-10-17",
			name: "Chung Yeung Day*",
		},
		{
			date: "2018-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "Additional New Year Holiday",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-04",
			name: "Lunar NY Eve 1",
		},
		{
			date: "2019-02-05",
			name: "Lunar New Year 1",
		},
		{
			date: "2019-02-06",
			name: "Lunar New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Lunar New Year 3",
		},
		{
			date: "2019-02-08",
			name: "Lunar New Year 4",
		},
		{
			date: "2019-04-05",
			name: "Ching Ming Festival",
		},
		{
			date: "2019-04-18",
			name: "Day before HK Good Friday",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-05-10",
			name: "Day Before Buddha's Birthday",
		},
		{
			date: "2019-05-13",
			name: "Buddha's Birthday*",
		},
		{
			date: "2019-06-07",
			name: "Tuen Ng Day*",
		},
		{
			date: "2019-06-07",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2019-06-28",
			name: "No trading 2",
		},
		{
			date: "2019-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2019-09-13",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2019-10-01",
			name: "National Day 1",
		},
		{
			date: "2019-10-02",
			name: "National Day 2",
		},
		{
			date: "2019-10-03",
			name: "National Day 3",
		},
		{
			date: "2019-10-04",
			name: "National Day 4",
		},
		{
			date: "2019-10-07",
			name: "National Day 7",
		},
		{
			date: "2019-10-07",
			name: "Chung Yeung Day*",
		},
		{
			date: "2019-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Lunar New Year 3",
		},
		{
			date: "2020-01-28",
			name: "Lunar New Year 4",
		},
		{
			date: "2020-01-29",
			name: "Lunar New Year 5",
		},
		{
			date: "2020-01-30",
			name: "Lunar New Year 6",
		},
		{
			date: "2020-04-09",
			name: "Day before HK Good Friday",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-04-30",
			name: "Buddha's Birthday*",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-25",
			name: "Tuen Ng Day*",
		},
		{
			date: "2020-06-25",
			name: "Dragon Boat Festival (Tuen Ng Day)*",
		},
		{
			date: "2020-07-01",
			name: "SAR Establishment Day",
		},
		{
			date: "2020-10-01",
			name: "National Day 1",
		},
		{
			date: "2020-10-01",
			name: "Mid-autumn Festival*",
		},
		{
			date: "2020-10-02",
			name: "National Day 2",
		},
		{
			date: "2020-10-02",
			name: "Day Following Mid-autumn Festival*",
		},
		{
			date: "2020-10-05",
			name: "National Day 5",
		},
		{
			date: "2020-10-26",
			name: "Chung Yeung Day*",
		},
		{
			date: "2020-12-24",
			name: "Day before HK Christmas",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
	],
	name: "Shanghai-HK Stock Connect (Northbound Trading)",
	hour_aligned: false,
};

CIQ.Market.XTKS = {
	market_tz: "Asia/Tokyo",
	rules: [
		{
			dayofweek: 1,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 1,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 2,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 2,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 3,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 3,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 4,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 4,
			open: "12:30",
			close: "15:00",
		},
		{
			dayofweek: 5,
			open: "09:30",
			close: "11:30",
		},
		{
			dayofweek: 5,
			open: "12:30",
			close: "15:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2018-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2018-01-08",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2018-02-12",
			name: "National Founding Day OBS",
		},
		{
			date: "2018-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2018-04-30",
			name: "Showa Day (formerly Greenery Day) OBS",
		},
		{
			date: "2018-05-03",
			name: "Constitution Day",
		},
		{
			date: "2018-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2018-07-16",
			name: "Marine Day",
		},
		{
			date: "2018-09-17",
			name: "Respect for the Aged Day",
		},
		{
			date: "2018-09-24",
			name: "Autumn Equinox OBS",
		},
		{
			date: "2018-10-08",
			name: "Health-Sports Day",
		},
		{
			date: "2018-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2018-12-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2019-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2019-01-14",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2019-02-11",
			name: "National Founding Day",
		},
		{
			date: "2019-03-21",
			name: "Vernal Equinox",
		},
		{
			date: "2019-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2019-04-30",
			name: "Bridge Holiday",
		},
		{
			date: "2019-05-01",
			name: "Accession to the Throne of New Emperor",
		},
		{
			date: "2019-05-02",
			name: "Bridge Holiday 2",
		},
		{
			date: "2019-05-03",
			name: "Constitution Day",
		},
		{
			date: "2019-05-06",
			name: "Children's Day OBS",
		},
		{
			date: "2019-07-15",
			name: "Marine Day",
		},
		{
			date: "2019-08-12",
			name: "Mountain Day OBS",
		},
		{
			date: "2019-09-16",
			name: "Respect for the Aged Day",
		},
		{
			date: "2019-09-23",
			name: "Autumn Equinox",
		},
		{
			date: "2019-10-14",
			name: "Health-Sports Day",
		},
		{
			date: "2019-10-22",
			name: "Enthronement Ceremony",
		},
		{
			date: "2019-11-04",
			name: "Culture Day OBS",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-02",
			name: "Bank Holiday 2",
		},
		{
			date: "2020-01-03",
			name: "Bank Holiday 3",
		},
		{
			date: "2020-01-13",
			name: "Coming of Age  (Adults') Day",
		},
		{
			date: "2020-02-11",
			name: "National Founding Day",
		},
		{
			date: "2020-02-24",
			name: "Emperor's Birthday OBS",
		},
		{
			date: "2020-03-20",
			name: "Vernal Equinox",
		},
		{
			date: "2020-04-29",
			name: "Showa Day (formerly Greenery Day)",
		},
		{
			date: "2020-05-04",
			name: "Greenery Day (formerly National Holiday)",
		},
		{
			date: "2020-05-05",
			name: "Children's Day",
		},
		{
			date: "2020-05-06",
			name: "Constitution Day OBS",
		},
		{
			date: "2020-07-23",
			name: "Marine Day",
		},
		{
			date: "2020-07-24",
			name: "Health-Sports Day",
		},
		{
			date: "2020-08-10",
			name: "Mountain Day",
		},
		{
			date: "2020-09-21",
			name: "Respect for the Aged Day",
		},
		{
			date: "2020-09-22",
			name: "Autumn Equinox",
		},
		{
			date: "2020-11-03",
			name: "Culture Day",
		},
		{
			date: "2020-11-23",
			name: "Labour Thanksgiving Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
	],
	name: "Tokyo Stock Exchange",
	hour_aligned: false,
};

CIQ.Market.XTUR = {
	market_tz: "Europe/Istanbul",
	name: "Turkish Derivatives Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "09:55",
			close: "18:05",
		},
		{
			dayofweek: 2,
			open: "09:55",
			close: "18:05",
		},
		{
			dayofweek: 3,
			open: "09:55",
			close: "18:05",
		},
		{
			dayofweek: 4,
			open: "09:55",
			close: "18:05",
		},
		{
			dayofweek: 5,
			open: "09:55",
			close: "18:05",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2018-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2018-06-15",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2018-08-21",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2018-08-22",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2018-08-23",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2018-08-24",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2018-08-30",
			name: "Victory Day",
		},
		{
			date: "2018-10-29",
			name: "Republic Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2019-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2019-06-04",
			name: "Ramadan (Shaker) Bairam 1*",
		},
		{
			date: "2019-06-05",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2019-06-06",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2019-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2019-08-12",
			name: "Kurban Bairam 2*",
		},
		{
			date: "2019-08-13",
			name: "Kurban Bairam 3*",
		},
		{
			date: "2019-08-14",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2019-08-30",
			name: "Victory Day",
		},
		{
			date: "2019-10-29",
			name: "Republic Day",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-23",
			name: "National Sovereignty and Children's Day",
		},
		{
			date: "2020-05-01",
			name: "Labour and Solidarity Day",
		},
		{
			date: "2020-05-19",
			name: "Youth and Sports Day",
		},
		{
			date: "2020-05-25",
			name: "Ramadan (Shaker) Bairam 2*",
		},
		{
			date: "2020-05-26",
			name: "Ramadan (Shaker) Bairam 3*",
		},
		{
			date: "2020-07-15",
			name: "Democracy and National Unity Day",
		},
		{
			date: "2020-07-31",
			name: "Kurban Bairam 1*",
		},
		{
			date: "2020-08-03",
			name: "Kurban Bairam 4*",
		},
		{
			date: "2020-10-29",
			name: "Republic Day",
		},
		{
			date: "2019-06-03",
			open: "09:55",
			close: "12:35",
		},
		{
			date: "2019-10-28",
			open: "09:55",
			close: "12:35",
		},
	],
};

CIQ.Market.XSTU = {
	market_tz: "Europe/Berlin",
	name: "Stuttgart Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 2,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 3,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 4,
			open: "08:00",
			close: "22:00",
		},
		{
			dayofweek: 5,
			open: "08:00",
			close: "22:00",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-30",
			name: "Good Friday",
		},
		{
			date: "2018-04-02",
			name: "Easter Monday",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-05-21",
			name: "Whitmonday",
		},
		{
			date: "2018-10-03",
			name: "National Day",
		},
		{
			date: "2018-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2018-12-25",
			name: "Christmas Day",
		},
		{
			date: "2018-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2018-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-04-19",
			name: "Good Friday",
		},
		{
			date: "2019-04-22",
			name: "Easter Monday",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-10",
			name: "Whitmonday",
		},
		{
			date: "2019-10-03",
			name: "National Day",
		},
		{
			date: "2019-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2019-12-25",
			name: "Christmas Day",
		},
		{
			date: "2019-12-26",
			name: "Christmas Holiday",
		},
		{
			date: "2019-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-04-10",
			name: "Good Friday",
		},
		{
			date: "2020-04-13",
			name: "Easter Monday",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-06-01",
			name: "Whitmonday",
		},
		{
			date: "2020-12-24",
			name: "Christmas Eve",
		},
		{
			date: "2020-12-25",
			name: "Christmas Day",
		},
		{
			date: "2020-12-31",
			name: "New Year's Eve",
		},
		{
			date: "2019-12-30",
			open: "08:00",
			close: "14:00",
		},
	],
};

CIQ.Market.XTUN = {
	market_tz: "Africa/Tunis",
	name: "Tunis Bourse",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "14:10",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "14:10",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "14:10",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "14:10",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "14:10",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-03-20",
			name: "Independence Day",
		},
		{
			date: "2018-04-09",
			name: "Martyrs Day",
		},
		{
			date: "2018-05-01",
			name: "Labour Day",
		},
		{
			date: "2018-06-15",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2018-07-25",
			name: "Republic Day",
		},
		{
			date: "2018-08-13",
			name: "Women's Day",
		},
		{
			date: "2018-08-21",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2018-08-22",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2018-09-11",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2018-10-15",
			name: "Anniversary of Evacuation",
		},
		{
			date: "2018-11-20",
			name: "Prophet's Birthday*",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-01-14",
			name: "Revolution Day",
		},
		{
			date: "2019-03-20",
			name: "Independence Day",
		},
		{
			date: "2019-04-09",
			name: "Martyrs Day",
		},
		{
			date: "2019-05-01",
			name: "Labour Day",
		},
		{
			date: "2019-06-04",
			name: "Eid al-Fitr 1*",
		},
		{
			date: "2019-06-05",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2019-06-06",
			name: "Eid al-Fitr 3",
		},
		{
			date: "2019-07-25",
			name: "Republic Day",
		},
		{
			date: "2019-08-12",
			name: "Eid al-Adha 2*",
		},
		{
			date: "2019-08-13",
			name: "Women's Day",
		},
		{
			date: "2019-10-15",
			name: "Anniversary of Evacuation",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-14",
			name: "Revolution Day",
		},
		{
			date: "2020-03-20",
			name: "Independence Day",
		},
		{
			date: "2020-04-09",
			name: "Martyrs Day",
		},
		{
			date: "2020-05-01",
			name: "Labour Day",
		},
		{
			date: "2020-05-25",
			name: "Eid al-Fitr 2*",
		},
		{
			date: "2020-07-31",
			name: "Eid al-Adha 1*",
		},
		{
			date: "2020-08-13",
			name: "Women's Day",
		},
		{
			date: "2020-08-20",
			name: "Islamic (Hijri) New Year*",
		},
		{
			date: "2020-10-15",
			name: "Anniversary of Evacuation",
		},
		{
			date: "2020-10-29",
			name: "Prophet's Birthday*",
		},
	],
};

CIQ.Market.XULA = {
	market_tz: "Asia/Ulaanbaatar",
	name: "Mongolian Stock Exchange",
	hour_aligned: false,
	rules: [
		{
			dayofweek: 1,
			open: "10:00",
			close: "13:05",
		},
		{
			dayofweek: 2,
			open: "10:00",
			close: "13:05",
		},
		{
			dayofweek: 3,
			open: "10:00",
			close: "13:05",
		},
		{
			dayofweek: 4,
			open: "10:00",
			close: "13:05",
		},
		{
			dayofweek: 5,
			open: "10:00",
			close: "13:05",
		},
		{
			date: "2018-01-01",
			name: "New Year's Day",
		},
		{
			date: "2018-02-16",
			name: "Mongolian New Year",
		},
		{
			date: "2018-03-08",
			name: "Women's Day",
		},
		{
			date: "2018-06-01",
			name: "Mother and Child Day",
		},
		{
			date: "2018-07-11",
			name: "Naadam",
		},
		{
			date: "2018-07-12",
			name: "Naadam 2",
		},
		{
			date: "2018-07-13",
			name: "Naadam 3",
		},
		{
			date: "2018-11-08",
			name: "Great Emperor Chinggis Khan Day",
		},
		{
			date: "2018-11-09",
			name: "Bridge Holiday",
		},
		{
			date: "2018-11-26",
			name: "Independence Day",
		},
		{
			date: "2019-01-01",
			name: "New Year's Day",
		},
		{
			date: "2019-02-05",
			name: "Mongolian New Year",
		},
		{
			date: "2019-02-06",
			name: "Mongolian New Year 2",
		},
		{
			date: "2019-02-07",
			name: "Mongolian New Year 3",
		},
		{
			date: "2019-03-08",
			name: "Women's Day",
		},
		{
			date: "2019-07-11",
			name: "Naadam",
		},
		{
			date: "2019-07-12",
			name: "Naadam 2",
		},
		{
			date: "2019-07-15",
			name: "Naadam 5",
		},
		{
			date: "2020-01-01",
			name: "New Year's Day",
		},
		{
			date: "2020-01-27",
			name: "Mongolian New Year 3",
		},
		{
			date: "2020-06-01",
			name: "Mother and Child Day",
		},
		{
			date: "2020-07-13",
			name: "Naadam 3",
		},
		{
			date: "2020-07-14",
			name: "Naadam 4",
		},
		{
			date: "2020-07-15",
			name: "Naadam 5",
		},
		{
			date: "2020-12-29",
			name: "Restoration of National Liberty and Independence Day",
		},
	],
};
