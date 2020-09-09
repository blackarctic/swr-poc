import { useState, useMemo } from "react";
import { keyBy, sortBy } from "lodash";
import { createContainer } from "unstated-next";

import { Place } from "../models";
import { usePlacesStateEffects } from "./usePlacesStateEffects";

export const {
  Provider: ProviderForUsePlacesState,
  useContainer: usePlacesState,
} = createContainer(() => {
  const [data, setData] = useState<Place[] | null | undefined>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);

  const isLoading = !isError && !data;

  const dataById = useMemo(() => {
    return keyBy(data, "id");
  }, [data]);

  const dataSortedByName = useMemo(() => {
    return sortBy(data, "name");
  }, [data]);

  const dataSortedByNameKey = useMemo(() => {
    if (!dataSortedByName) {
      return "";
    }
    return dataSortedByName.map((x) => x.id).join(" ");
  }, [dataSortedByName]);

  const result = {
    setData,
    setIsValidating,
    setIsError,
    data,
    isError,
    isValidating,
    isLoading,
    dataById,
    dataSortedByName,
    dataSortedByNameKey,
  };

  usePlacesStateEffects(result);

  return result;
});
