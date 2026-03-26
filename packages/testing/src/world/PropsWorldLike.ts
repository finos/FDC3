export interface PropsWorldLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  log(message: string): void;
}
