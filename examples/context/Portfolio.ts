interface Portfolio extends Context {
    type: 'fdc3.portfolio',
    id: {
        portfolioId?: string;
    },
    positions: Position[]
}
