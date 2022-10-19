import { ContextItem } from "../store/ContextStore";

export const contexts: ContextItem[] = [
	{
		id: "Contact example",
		template: {
			type: "fdc3.contact",
			name: "Jane Doe",
			id: {
				email: "jane.doe@mail.com",
			},
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/contact.schema.json"),
	},
	{
		id: "ContactList example",
		template: {
			type: "fdc3.contactList",
			contacts: [
				{
					type: "fdc3.contact",
					name: "Jane Doe",
					id: {
						email: "jane.doe@mail.com",
					},
				},
				{
					type: "fdc3.contact",
					name: "John Doe",
					id: {
						email: "john.doe@mail.com",
					},
				},
			],
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/contactList.schema.json"),
	},
	{
		id: "Instrument example",
		template: {
			type: "fdc3.instrument",
			name: "Microsoft",
			id: {
				ticker: "MSFT",
				RIC: "MSFT.OQ",
				ISIN: "US5949181045",
			},
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/instrument.schema.json"),
	},
	{
		id: "InstrumentList example",
		template: {
			type: "fdc3.instrumentList",
			instruments: [
				{
					type: "fdc3.instrument",
					id: {
						ticker: "AAPL",
					},
				},
				{
					type: "fdc3.instrument",
					id: {
						ticker: "MSFT",
					},
				},
			],
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/instrumentList.schema.json"),
	},
	{
		id: "Organization example",
		template: {
			type: "fdc3.organization",
			name: "Cargill, Incorporated",
			id: {
				LEI: "QXZYQNMR4JZ5RIRN4T31",
				FDS_ID: "00161G-E",
			},
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/organization.schema.json"),
	},
	{
		id: "Country example",
		template: {
			type: "fdc3.country",
			name: "Sweden",
			id: {
				ISOALPHA3: "SWE",
			},
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/country.schema.json"),
	},
	{
		id: "Position example",
		template: {
			type: "fdc3.position",
			instrument: {
				type: "fdc3.instrument",
				id: {
					ticker: "AAPL",
				},
			},
			holding: 2000000,
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/position.schema.json"),
	},
	{
		id: "Portfolio example",
		template: {
			type: "fdc3.portfolio",
			positions: [
				{
					type: "fdc3.position",
					instrument: {
						type: "fdc3.instrument",
						id: {
							ticker: "AAPL",
						},
					},
					holding: 2000000,
				},
				{
					type: "fdc3.position",
					instrument: {
						type: "fdc3.instrument",
						id: {
							ticker: "MSFT",
						},
					},
					holding: 1500000,
				},
				{
					type: "fdc3.position",
					instrument: {
						type: "fdc3.instrument",
						id: {
							ticker: "IBM",
						},
					},
					holding: 3000000,
				},
			],
		},
		schemaUrl: new URL("https://fdc3.finos.org/schemas/1.2/portfolio.schema.json"),
	},
];
