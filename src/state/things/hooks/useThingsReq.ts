import useSWR from "swr";

import { persistInCache } from "../../../utils/cache";
import { Place, usePlaces } from "../../places";
import { Thing } from "../models";
import { ENDPOINT_URL } from "../constants";
import { useThingsReqKey } from "./useThingsReqKey";

const getFetchEndpointUrl = ({
  places,
}: {
  places: Place[] | null | undefined;
}) => {
  if (places) {
    const params = places.length
      ? places.map((x) => `placeId=${x.id}`).join("&")
      : "placeId=none";
    return `${ENDPOINT_URL}?${params}`;
  }
  return null;
};

export const useThingsReq = () => {
  const { setReqKey } = useThingsReqKey();

  const { dataSortedByName: places, isError: isPlacesError } = usePlaces();
  const endpointUrl = getFetchEndpointUrl({ places });
  const reqKey = endpointUrl;
  setReqKey(reqKey);

  const isDepsError = isPlacesError;

  const res = useSWR<Thing[]>(reqKey, {
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
    reqKey,
    resData,
    resError,
    resIsValidating,
    isDepsError,
    revalidate,
    mutate,
  };
};
