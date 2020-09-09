import { useEffect } from "react";
import { debounce } from "lodash";

import { retrieveFromCacheMemoized } from "../../../utils/cache";
import { ENDPOINT_URL } from "../constants";
import { UseOrgsReqResult, UseOrgsStateResult } from "./types";

export const useOrgsReqToState = (
  { resData, resError, resIsValidating }: UseOrgsReqResult,
  { setData, setIsError, setIsValidating }: UseOrgsStateResult
) => {
  useEffect(() => {
    setData(resData);

    // If we have no response data,
    // we can at least try loading from the cache.
    if (!resData) {
      const cacheResult = retrieveFromCacheMemoized(ENDPOINT_URL);
      if (cacheResult) {
        setData(cacheResult);
      }
    }
  }, [setData, resData]);

  useEffect(
    debounce(() => {
      if (resError) {
        setIsError(true);
      } else if (!resIsValidating) {
        setIsError(!!resError);
      }
    }),
    [setIsError, resIsValidating, resError]
  );

  useEffect(() => {
    setIsValidating(resIsValidating);
  }, [setIsValidating, resIsValidating]);
};
