import { GridStackWidget } from "gridstack"

export type AppPanel = GridStackWidget & {
    title: string
    url?: string,
}

export type TabDetail = {
    title: string,
    channel: string,
    icon: string,
    background: string,
    items: AppPanel[]
}

export type ClientState = {
    tabs: TabDetail[],
    activeTab: number
}


export const CLIENT_STATE: ClientState = {
    tabs: [
        {
            title: "One",
            channel: "one",
            icon: "/static/icons/tabs/noun-airplane-3707662.svg",
            background: '#123456',
            items: [
                { id: "abc", x: 2, y: 1, h: 2, w: 1, title: "ovme" },
                { id: "def", x: 2, y: 4, w: 3, h: 1, title: "Barn Owl" },
                { id: "786", x: 4, y: 2, w: 1, h: 1, title: "Routine" },
                { id: "322323", x: 3, y: 1, h: 2, w: 1, title: "Maintenance Broncohippy" },
                { id: "45", x: 0, y: 6, w: 2, h: 2, title: "Sasquatch" }
            ]
        },
        {
            title: "Two",
            channel: "two",
            icon: "/static/icons/tabs/noun-camera-3707659.svg",
            background: '#564312',
            items: [
                { id: "786", x: 2, y: 1, h: 2, w: 1, title: "ovme" },
                { id: "67", x: 2, y: 4, w: 3, h: 1, title: "Barn Owl" },
                { id: "890", x: 4, y: 2, w: 1, h: 1, title: "Routine" }
            ]
        },
        {
            title: "Three",
            channel: "three",
            icon: "/static/icons/tabs/noun-driller-3707669.svg",
            background: '#125634',
            items: []
        }, {
            title: "Four",
            channel: "four",
            icon: "/static/icons/tabs/noun-radio-3707701.svg",
            background: '#ab1245',
            items: []
        }
    ],
    activeTab: 0
}