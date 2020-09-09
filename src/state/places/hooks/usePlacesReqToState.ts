import { useEffect } from "react";
import { debounce } from "lodash";

import { retrieveFromCacheMemoized } from "../../../utils/cache";
import { UsePlacesReqResult, UsePlacesStateResult } from "./types";

export const usePlacesReqToState = (
  {
    reqKey,
    resData,
    resError,
    resIsValidating,
    isDepsError,
  }: UsePlacesReqResult,
  { setData, setIsError, setIsValidating }: UsePlacesStateResult
) => {
  useEffect(() => {
    setData(resData);

    // If we have a request key and no response data,
    // we can at least try loading from the cache.
    if (reqKey && !resData) {
      const cacheResult = retrieveFromCacheMemoized(reqKey);
      if (cacheResult) {
        setData(cacheResult);
      }
    }
  }, [setData, resData, reqKey]);

  useEffect(
    debounce(() => {
      if (resError || isDepsError) {
        setIsError(true);
      } else if (!resIsValidating) {
        setIsError(!!resError);
      }
    }),
    [setIsError, resIsValidating, resError, isDepsError]
  );

  useEffect(() => {
    setIsValidating(resIsValidating);
  }, [setIsValidating, resIsValidating]);
};
