export type EventHandler = {
  type: string;
  callback: (e: Event) => void;
};
