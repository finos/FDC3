import { getAgent } from "@kite9/fdc3-get-agent";
import "./ag-grid.css";

// DATA
const MIN_BOOK_COUNT = 10;
const MAX_BOOK_COUNT = 20;

const MIN_TRADE_COUNT = 1;
const MAX_TRADE_COUNT = 10;

let nextBookId = 62472;
let nextTradeId = 24287;

const symbolList = [
  "MMM",
  "AXP",
  "TSLA",
  "AAPL",
  "BA",
  "CAT",
  "CVX",
  "CSCO",
  "KO",
  "DIS",
  "DOW",
  "XOM",
  "GS",
  "HD",
  "IBM",
  "INTC",
  "JNJ",
  "JPM",
  "MCD",
  "MRK",
  "MSFT",
  "MSFT",
  "NKE",
  "PFE",
  "PG",
  "TRV",
  "UTX",
  "UNH",
  "VZ",
  "V",
  "WMT",
  "WBA",
];
const portfolios = [
  "Aggressive",
  "Defensive",
  "Income",
  "Speculative",
  "Hybrid",
];

// FDC3 FUNCTIONS

const cellDoubleClickEventHandler = (event: any) => {
  if (event.column.left === 0 && event.value?.trim() !== "") {
    passContext(event.value);
  }
}
const passContext = (ticker: string) => {
  window.fdc3.broadcast({
    type: "fdc3.instrument",
    name: ticker,
    id: {
      ticker
    }
  })
}
const raiseIntent = (intent: string, ticker: string) => {
  window.fdc3.raiseIntent(intent, {
    type: "fdc3.instrument",
    name: ticker,
    id: {
      ticker
    }
  })
}

const init = async () => {
  // Initialize AG-Grid
  // @ts-ignore
  const { gridOptions } = new agGrid.Grid<HTMLDivElement>(
    document.querySelector("#myGrid"), // element
    setupGridOptions  // options (rows of data, interactions, etc)
  );

  // Handle changes to the filter box
  const filterBox = document.querySelector<HTMLInputElement>("#quick-filter-box")!;

  // Whenever a user types, filter the blotter by the search text
  filterBox.addEventListener("input", (e) => {
    // @ts-ignore
    gridOptions.api.setQuickFilter(e?.target.value);
  });

  // If the user presses ENTER, broadcast the search query as the context
  filterBox.addEventListener("keyup", (e) => {
    // @ts-ignore
    if (e.key === "Enter" && e.target?.value?.trim() !== "") {
      // @ts-ignore
      passContext(e.target.value.toUpperCase());
    }
  })


  // INITIALIZE FDC3
  try {
    // LINE CURRENTLY FAILS
    window.fdc3 = await getAgent();
    console.log(window.fdc3);

    // Listen for contexts
    window.fdc3.addContextListener((context) => {
      // We only care about type=fdc3.instrument. 
      // Ignore anything else.
      if (context.type !== "fdc3.instrument") return;

      const symbol = context.id?.ticker;
      // Show the symbol in the search box
      filterBox.value = symbol;
      // Apply a filter based on the symbol
      gridOptions.api.setQuickFilter(symbol);
    });
  } catch (err) {
    console.log("waiting...");
    console.error(err);
  }
};

const dollarFormatterRegEx = /(\d)(?=(\d{3})+(?!\d))/g;

type FormatterParams = {
  value: number;
};
type TradeRecord = {
  security: string;
  portfolio: string;
  book: string;
  trade: number;
  submitterID: number;
  submitterDealID: number;
  bidFlag: "Buy" | "Sell";
  current: number;
  previous: number;
  chng: number;
  pctchng: number;
  h52: number;
  l52: number;
  hlrange: number;
  pe: number;
}
type onReadyParams = {
  api: {
    setRowData: (trades: TradeRecord[]) => void;
  };
};

// GENERAL

const createBookName = () => `IQ-${++nextBookId}`;
const createTradeId = () => ++nextTradeId;
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const numberCellFormatter = ({ value }: FormatterParams) =>
  `$${Math.floor(value).toString().replace(dollarFormatterRegEx, "$1,")}`;
const gainLossFormatter = ({ value }: FormatterParams) =>
  value > 0 ? "gain" : "loss";
const percentCellFormatter = ({ value }: FormatterParams) =>
  value > 0 ? "gain" : "loss";

// Create a list of the data, that we modify as we go. if you are using an immutable
// data store (such as Redux) then this would be similar to your store of data.
const createRowData = () => {
  let rowData = [];
  for (let i = 0; i < symbolList.length; i++) {
    let symbol = symbolList[i];
    for (let j = 0; j < portfolios.length; j++) {
      let portfolio = portfolios[j];

      let bookCount = randomBetween(MAX_BOOK_COUNT, MIN_BOOK_COUNT);

      for (let k = 0; k < bookCount; k++) {
        let book = createBookName();
        let tradeCount = randomBetween(MAX_TRADE_COUNT, MIN_TRADE_COUNT);
        for (let l = 0; l < tradeCount; l++) {
          let trade = createTradeRecord(symbol, portfolio, book);
          rowData.push(trade);
        }
      }
    }
  }
  return rowData;
}
const createTradeRecord = (security: string, portfolio: string, book: string): TradeRecord => {
  let previous = Math.floor(Math.random() * 100000) + 100;
  let current = previous + Math.floor(Math.random() * 10000) - 2000;
  let difference = current - previous;

  let l52 = Math.floor(Math.random() * 100000) + 100;
  let h52 = l52 + Math.floor(Math.random() * 10000) - 2000;

  return {
    security,
    portfolio,
    book,
    trade: createTradeId(),
    submitterID: randomBetween(10, 1000),
    submitterDealID: randomBetween(10, 1000),
    bidFlag: (Math.random() < .5) ? 'Buy' : 'Sell',
    current: current,
    previous: previous,
    chng: difference,
    pctchng: (difference / previous) * 100,
    h52: h52,
    l52: l52,
    hlrange: h52 - l52,
    pe: randomBetween(385, 100000) / 100

  };
}

function BtnCellRenderer() { }

BtnCellRenderer.prototype.init = function (params: any) {
  this.params = params;

  this.eGui = document.createElement('button');
  this.eGui.innerHTML = params.title;

  this.btnClickedHandler = this.btnClickedHandler.bind(this);
  this.eGui.addEventListener('click', this.btnClickedHandler);
}

BtnCellRenderer.prototype.getGui = function () {
  return this.eGui;
}

BtnCellRenderer.prototype.destroy = function () {
  this.eGui.removeEventListener('click', this.btnClickedHandler);
}

BtnCellRenderer.prototype.btnClickedHandler = function () {
  this.params.clicked(this.params);
}

const setupGridOptions = {
  defaultColDef: {
    filter: "true", // set filtering on for all cols
    // width: 120,
    // sortable: true,
    // resizable: true,
  },
  floatingFilter: true,
  columnDefs: [
    // these are the row groups, so they are all hidden (they are show in the group column)
    {
      headerName: "Security",
      field: "security",
      enableRowGroup: true,
      enablePivot: true,
      rowGroupIndex: 0,
      hide: true,
      tooltipField: "security",
      tooltipComponentParams: { color: "#ececec" },
    },
    {
      headerName: "Portfolio",
      field: "portfolio",
      enableRowGroup: true,
      enablePivot: true,
      rowGroupIndex: 1,
      hide: true,
    },
    {
      headerName: "Book ID",
      field: "book",
      enableRowGroup: true,
      enablePivot: true,
      rowGroupIndex: 2,
      hide: true,
    },

    // all the other columns (visible and not grouped)
    {
      headerName: "Current",
      field: "current",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Previous",
      field: "previous",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Action",
      field: "security",
      width: 125,
      enableValue: true,
      cellRenderer: "btnCellRenderer",
      cellRendererParams: {
        title: "View chart",
        clicked: (params: { node: { key: string } }) => {
          raiseIntent("ViewChart", params.node.key);
        },
      },
    },
    {
      headerName: "Gain/Loss",
      field: "chng",
      width: 125,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: gainLossFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "% Change (avg)",
      field: "pctchng",
      width: 75,
      aggFunc: "avg",
      enableValue: true,
      cellClass: "number",
      cellRenderer: "agAnimateShowChangeCellRenderer",
      valueFormatter: percentCellFormatter,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "52 Wk High",
      field: "h52",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "52 Wk Low",
      field: "l52",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Hi-Low Range",
      field: "hlrange",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Current P/E",
      field: "pe",
      width: 100,
      aggFunc: "sum",
      enableValue: true,
      cellClass: "number",
      valueFormatter: numberCellFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
      filter: "agNumberColumnFilter",
    },

    {
      headerName: "Trade ID",
      field: "trade",
      width: 80,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Bid",
      field: "bidFlag",
      enableRowGroup: true,
      enablePivot: true,
      width: 80,
      filter: "agTextColumnFilter",
    },
  ],
  suppressAggFuncInHeader: true,
  animateRows: true,
  rowGroupPanelShow: "always",
  pivotPanelShow: "always",
  getRowNodeId: ({ trade }: { trade: string }) => trade,
  autoGroupColumnDef: {
    width: 200,
  },
  onGridReady: (params: onReadyParams) => {
    params.api.setRowData(createRowData());
  },
  onCellDoubleClicked: function (event: Event) {
    cellDoubleClickEventHandler(event);
  },
  components: {
    btnCellRenderer: BtnCellRenderer,
  },
};

window.addEventListener("load", init);
