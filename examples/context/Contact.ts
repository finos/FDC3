interface Contact extends Context {
    type: 'fdc3.contact',
    id: {
        email: string;
        twitter?: string;
        phone?: string;
    }
}