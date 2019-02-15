interface Instrument extends Context {
    type: 'fdc3.instrument';
    name: string;
    id: {
        ticker?: string;
        ISIN?: string;
        CUSIP?: string;
        SEDOL?: string;
        RIC?: string;
        BBG?: string;
        PERMID?: string;
        FIGI?: string;
    }
}