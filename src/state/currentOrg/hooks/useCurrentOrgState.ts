import { useState, useCallback, useMemo } from "react";
import { isFunction } from "lodash";
import { createContainer } from "unstated-next";

import {
  persistInCache,
  retrieveFromCacheMemoized,
} from "../../../utils/cache";
import { useOrgsState } from "../../orgs";
import { cacheKey } from "../constants";
import { useCurrentOrgEffects } from "./useCurrentOrgEffects";

export const {
  Provider: ProviderForUseCurrentOrgState,
  useContainer: useCurrentOrgState,
} = createContainer(() => {
  const [currentOrgId, _setCurrentOrgId] = useState<string | null>(
    retrieveFromCacheMemoized(cacheKey)
  );
  const { dataById: orgsById, isError: isOrgsError } = useOrgsState();

  const isError = isOrgsError;
  const isLoading = !isError && !orgsById;

  const setCurrentOrgId = useCallback(
    (val: Parameters<typeof _setCurrentOrgId>[0]) => {
      const newOrgId = isFunction(val) ? val(currentOrgId) : val;
      persistInCache(cacheKey, newOrgId);
      _setCurrentOrgId(newOrgId);
    },
    [currentOrgId]
  );

  const currentOrg = useMemo(() => {
    return (orgsById && currentOrgId ? orgsById[currentOrgId] : null) || null;
  }, [currentOrgId, orgsById]);

  const result = {
    setCurrentOrgId,
    currentOrg,
    isError,
    isLoading,
  };

  useCurrentOrgEffects(result);

  return result;
});
