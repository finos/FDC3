interface Country extends Context {
    type: 'fdc3.country',
    name: string;
    id: {
        ISOALPHA2?: string;
        ISOALPHA3?: string;
    }
}