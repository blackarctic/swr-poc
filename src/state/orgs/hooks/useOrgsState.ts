import { useState, useMemo } from "react";
import { keyBy, sortBy } from "lodash";
import { createContainer } from "unstated-next";

import { Org } from "../models";

export const {
  Provider: ProviderForUseOrgsState,
  useContainer: useOrgsState,
} = createContainer(() => {
  const [data, setData] = useState<Org[] | null | undefined>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);

  const isLoading = !isError && !data;

  const dataById = useMemo(() => {
    return keyBy(data, "id");
  }, [data]);

  const dataSortedByName = useMemo(() => {
    return sortBy(data, "name");
  }, [data]);

  return {
    setData,
    setIsValidating,
    setIsError,
    data,
    isError,
    isValidating,
    isLoading,
    dataById,
    dataSortedByName,
  };
});
