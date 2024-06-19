type ChannelDetails = {
  id: string;
  displayMetadata: {
    name: string;
    color: string;
    glyph?: string;
  }
};
type Message_iframeChannels = {
  type: "iframeChannels";
  channels: ChannelDetails[];
  selected: string;
}
type Message_resize = {
  type: "iframeChannelResize";
  expanded: boolean;
}
export type ReceivedMessages = Message_iframeChannels | Message_resize;