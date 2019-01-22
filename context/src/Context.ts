interface Context {
    /**
     * The type of the context that uniquely identifies it, e.g. "fdc3.instrument"     
     * Used to refer to the accepted context(s) when declaring intents.
     */
    type: string;

    /**
     * The name of the context data (optional).
     * Implementors of context may choose to make the name mandatory.
     */
    name?: string;

    /**
     * An optional map of any equivalent identifiers for the
     * context type, e.g. ISIN, CUSIP, etc. for an instrument.
     */
    id?: {
        [x:string]: string;
    },

    /**
     * A context object is open for extension with any custom properties/metadata.
     */
    [x: string]: any;
}