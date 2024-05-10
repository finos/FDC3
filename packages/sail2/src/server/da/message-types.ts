
export const DA_HELLO = 'da-hello'
export const APP_HELLO = 'app-hello'
export const FDC3_APP_EVENT = 'fdc3-app-event'
export const DA_OPEN = 'da-open'

export type ChannelMetadata = {
    id: string
    displayName: string,
    color: string,
    icon: string
}

export type HelloArgs = {
    id: string,
    directories: string[],
    channels: ChannelMetadata[]
}
