import { useCallback, useState, useEffect } from "react";
import { v4 as generateUuid } from "uuid";
import { createContainer } from "unstated-next";

import { Message, MessageConfig } from "./models";

const ANIMATION_TIMEOUT = 300;
const DISMISS_TIMEOUT = 3000;

const dismissTimeoutIdsByMessageId: Record<string, NodeJS.Timeout> = {};
const messageConfigsByMessageId: Record<string, MessageConfig> = {};

const findInArray = <T>(
  array: T[],
  criteriaFn: (item: T) => boolean
): [T | null, number] => {
  const index = array.findIndex(criteriaFn);
  const item = index !== -1 ? array[index] : null;
  return [item, index];
};

export const {
  Provider: ProviderForUseMessages,
  useContainer: useMessages,
} = createContainer(() => {
  const [messages, setMessages] = useState<Message[]>([]);

  const cleanMessages = useCallback(() => {
    // We keep messages in the list after they have been dismissed
    // so that animations work as expected. They can be removed safely
    // after the animation completes (~300ms)
    setMessages((state) => {
      const newState = state.filter(
        (x) =>
          !x.dismissedAtMs || Date.now() - x.dismissedAtMs < ANIMATION_TIMEOUT
      );
      if (newState.length === state.length) {
        return state;
      }
      return newState;
    });
  }, [setMessages]);

  const dismissMessage = useCallback(
    (id: string) => {
      cleanMessages();

      setMessages((state) => {
        const [targetMessage, targetMessageIndex] = findInArray(
          state,
          (x) => !!(x.id === id && !x.dismissedAtMs)
        );
        if (!targetMessage) {
          return state;
        }

        const newState = [...state];
        newState[targetMessageIndex] = {
          ...targetMessage,
          dismissedAtMs: Date.now(),
        };
        return newState;
      });

      delete dismissTimeoutIdsByMessageId[id];
      delete messageConfigsByMessageId[id];
    },
    [setMessages, cleanMessages]
  );

  const displayMessage = useCallback(
    (messageConfig: MessageConfig) => {
      cleanMessages();

      const { id = generateUuid() } = messageConfig;
      const message: Message = {
        id,
        dismissedAtMs: null,
        ...messageConfig,
      };
      setMessages((state) => {
        const [messageInState] = findInArray(state, (x) => x.id === id);

        if (message.shouldBeAutoDismissed) {
          // If there is an old timeout for this same message id,
          // clear it and start a new one.
          if (dismissTimeoutIdsByMessageId[id]) {
            clearTimeout(dismissTimeoutIdsByMessageId[id]);
          }
          const timeoutId = setTimeout(
            () => dismissMessage(id),
            DISMISS_TIMEOUT
          );
          dismissTimeoutIdsByMessageId[id] = timeoutId;
        }

        if (messageInState) {
          // If we already have a message with this id
          // and the message config objects are equal,
          // then we can skip this state update.
          const areMessageConfigsEqual =
            messageConfigsByMessageId[id] === messageConfig;
          if (areMessageConfigsEqual) {
            return state;
          }
          // Otherwise, we need to remove the message and push the new message.
          messageConfigsByMessageId[id] = messageConfig;
          return [...state.filter((x) => x.id !== id), message];
        }
        // If we do not already have a message with this id,
        // simply push the new message.
        messageConfigsByMessageId[id] = messageConfig;
        return [...state, message];
      });
    },
    [setMessages, dismissMessage, cleanMessages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    displayMessage,
    dismissMessage,
    clearMessages,
  };
});

export const useClearMessagesOnMount = () => {
  const { clearMessages } = useMessages();

  useEffect(() => {
    clearMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export type UseMessagesResult = ReturnType<typeof useMessages>;
export type UseClearMessagesOnMountResult = ReturnType<
  typeof useClearMessagesOnMount
>;
