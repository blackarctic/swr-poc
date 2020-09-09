import { useCallback } from "react";

import { useMessages } from "../../messages";
import { Thing, NewThing } from "../models";
import { ENDPOINT_URL } from "../constants";
import { postReq, putReq, deleteReq } from "../../../utils/reqs";
import { UseThingsReqResult } from "./types";
import { useThingsReqKey } from "./useThingsReqKey";

export const useThingsMutateReqs = ({ mutate }: UseThingsReqResult) => {
  const { displayMessage } = useMessages();
  const { getReqKey } = useThingsReqKey();
  const getFetchReqKey = getReqKey;

  const removeThing = useCallback(
    (id: string) => {
      deleteReq<Thing>({
        mutate,
        displayMessage,
        getFetchReqKey,
        id,
        url: ENDPOINT_URL,
        entityName: "thing",
      });
    },
    [mutate, displayMessage, getFetchReqKey]
  );

  const updateThing = useCallback(
    (thing: Thing) => {
      putReq<Thing>({
        mutate,
        displayMessage,
        getFetchReqKey,
        url: ENDPOINT_URL,
        item: thing,
      });
    },
    [mutate, displayMessage, getFetchReqKey]
  );

  const createThing = useCallback(
    (newThing: NewThing) => {
      postReq<Thing>({
        mutate,
        displayMessage,
        url: ENDPOINT_URL,
        newItem: newThing,
      });
    },
    [mutate, displayMessage]
  );

  return {
    removeThing,
    updateThing,
    createThing,
  };
};
