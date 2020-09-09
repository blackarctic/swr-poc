import { Message } from "./models";

export const isMessageVisible = (message: Message) => {
  return !message.dismissedAtMs;
};
