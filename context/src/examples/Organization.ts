interface Organization extends Context {
    type: 'fdc3.organization',
    name: string;
    id: {
        LEI?: string;
        PERMID?: string;
    }
}