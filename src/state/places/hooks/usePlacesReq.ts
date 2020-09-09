import useSWR from "swr";

import { persistInCache } from "../../../utils/cache";
import { useCurrentOrg } from "../../currentOrg";
import { Place } from "../models";
import { ENDPOINT_URL } from "../constants";
import { usePlacesReqKey } from "./usePlacesReqKey";

const getFetchEndpointUrl = ({
  currentOrgId,
}: {
  currentOrgId: string | undefined | null;
}) => {
  return currentOrgId ? `${ENDPOINT_URL}?orgId=${currentOrgId}` : null;
};

export const usePlacesReq = () => {
  const { setReqKey } = usePlacesReqKey();

  const { currentOrg, isError: isCurrentOrgError } = useCurrentOrg();
  const endpointUrl = getFetchEndpointUrl({ currentOrgId: currentOrg?.id });
  const reqKey = endpointUrl;
  setReqKey(reqKey);

  const isDepsError = isCurrentOrgError;

  const res = useSWR<Place[]>(reqKey, {
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
