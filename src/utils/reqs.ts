import axios from "axios";
import { v4 as generateUuid } from "uuid";
import { responseInterface } from "swr";

import { retrieveFromCacheMemoized } from "../utils/cache";
import { MessageConfig } from "../state/messages";

export const postReq = async <Item extends { id: string; name: string }>({
  url,
  newItem,
  mutate,
  displayMessage,
}: {
  url: string;
  newItem: Omit<Item, "id"> & { id?: string };
  mutate: responseInterface<Item[], any>["mutate"];
  displayMessage: (messageConfig: MessageConfig) => void;
}) => {
  const { id = generateUuid() } = newItem;
  const item = {
    id,
    ...newItem,
  } as Item;

  mutate((data) => {
    (async () => {
      try {
        // Attempt to update on server
        await axios.post(url, item);
      } catch (error) {
        // Revert locally (optimistic UI)
        mutate(data, false);
        // Display feedback to the user
        const message = `Unable to add "${item.name}"`;
        displayMessage({
          color: "danger",
          message,
          shouldBeAutoDismissed: true,
        });
      }
      // Attempt to revalidate with server
      mutate();
    })();

    // Update locally (optimistic UI)
    if (data) {
      return [...data, item];
    }
    return data;
  }, false);
};

export const putReq = async <Item extends { id: string; name: string }>({
  item,
  url,
  entityName = "item",
  mutate,
  displayMessage,
  getFetchReqKey,
}: {
  item: Item;
  url: string;
  entityName?: string;
  mutate: responseInterface<Item[], any>["mutate"];
  displayMessage: (messageConfig: MessageConfig) => void;
  getFetchReqKey: () => string | null;
}) => {
  mutate((data) => {
    (async () => {
      try {
        // Attempt to update on server
        await axios.put(`${url}/${item.id}`, item);
      } catch (error) {
        // Revert locally (optimistic UI)
        mutate(data, false);
        // Display feedback to the user
        const cache: typeof data = retrieveFromCacheMemoized(getFetchReqKey());
        const original = (data || cache)?.find((x) => x.id === item.id);
        const message = original
          ? `Unable to update "${original.name}"`
          : `Unable to update ${entityName}`;
        displayMessage({
          color: "danger",
          message,
          shouldBeAutoDismissed: true,
        });
      }
      // Attempt to revalidate with server
      mutate();
    })();

    // Update locally (optimistic UI)
    if (data) {
      return data.map((x) => (x.id === item.id ? item : x));
    }
    return data;
  }, false);
};

export const deleteReq = async <Item extends { id: string; name: string }>({
  id,
  url,
  entityName = "item",
  mutate,
  displayMessage,
  getFetchReqKey,
}: {
  id: string;
  url: string;
  entityName?: string;
  mutate: responseInterface<Item[], any>["mutate"];
  displayMessage: (messageConfig: MessageConfig) => void;
  getFetchReqKey: () => string | null;
}) => {
  mutate((data) => {
    (async () => {
      try {
        // Attempt to update on server
        await axios.delete(`${url}/${id}`);
      } catch (error) {
        // Revert locally (optimistic UI)
        mutate(data, false);
        // Display feedback to the user
        const cache: typeof data = retrieveFromCacheMemoized(getFetchReqKey());
        const original = (data || cache)?.find((x) => x.id === id);
        const message = original
          ? `Unable to remove "${original.name}"`
          : `Unable to remove ${entityName}`;
        displayMessage({
          color: "danger",
          message,
          shouldBeAutoDismissed: true,
        });
      }
      // Attempt to revalidate with server
      mutate();
    })();

    // Update locally (optimistic UI)
    if (data) {
      return data.filter((x) => x.id !== id);
    }
    return data;
  }, false);
};
