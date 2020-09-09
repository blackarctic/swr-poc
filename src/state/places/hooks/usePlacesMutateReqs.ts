import { useCallback } from "react";

import { useMessages } from "../../messages";
import { Place, NewPlace } from "../models";
import { ENDPOINT_URL } from "../constants";
import { postReq, putReq, deleteReq } from "../../../utils/reqs";
import { UsePlacesReqResult } from "./types";
import { usePlacesReqKey } from "./usePlacesReqKey";

export const usePlacesMutateReqs = ({ mutate }: UsePlacesReqResult) => {
  const { displayMessage } = useMessages();
  const { getReqKey } = usePlacesReqKey();
  const getFetchReqKey = getReqKey;

  const removePlace = useCallback(
    (id: string) => {
      deleteReq<Place>({
        mutate,
        displayMessage,
        getFetchReqKey,
        id,
        url: ENDPOINT_URL,
        entityName: "place",
      });
    },
    [mutate, displayMessage, getFetchReqKey]
  );

  const updatePlace = useCallback(
    (place: Place) => {
      putReq<Place>({
        mutate,
        displayMessage,
        getFetchReqKey,
        url: ENDPOINT_URL,
        item: place,
      });
    },
    [mutate, displayMessage, getFetchReqKey]
  );

  const createPlace = useCallback(
    (newPlace: NewPlace) => {
      postReq<Place>({
        mutate,
        displayMessage,
        url: ENDPOINT_URL,
        newItem: newPlace,
      });
    },
    [mutate, displayMessage]
  );

  return {
    removePlace,
    updatePlace,
    createPlace,
  };
};
