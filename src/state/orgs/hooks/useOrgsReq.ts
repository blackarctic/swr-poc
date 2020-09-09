import useSWR from "swr";

import { persistInCache } from "../../../utils/cache";
import { Org } from "../models";
import { ENDPOINT_URL } from "../constants";

export const useOrgsReq = () => {
  const res = useSWR<Org[]>(ENDPOINT_URL, {
    onSuccess: (data, key) => {
      persistInCache(key, data);
    },
  });

  const {
    data: resData,
    error: resError,
    isValidating: resIsValidating,
    revalidate,
    mutate,
  } = res;

  return {
    resData,
    resError,
    resIsValidating,
    revalidate,
    mutate,
  };
};
