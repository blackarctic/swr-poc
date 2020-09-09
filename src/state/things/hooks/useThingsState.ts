import { useState } from "react";
import { keyBy, sortBy, groupBy } from "lodash";
import memoize from "memoizee";

import { Thing } from "../models";
import { useThingsStateEffects } from "./useThingsStateEffects";

const calcDataById = memoize(<T>(data: T[] | null | undefined) => {
  return keyBy(data, "id");
});

const calcDataSortedByName = memoize(<T>(data: T[] | null | undefined) => {
  return sortBy(data, "name");
});

const calcDataSortedByNameKey = memoize(
  <T extends { id: string }>(dataSortedByName: T[]) => {
    if (!dataSortedByName) {
      return "";
    }
    return dataSortedByName.map((x) => x.id).join(" ");
  }
);

const calcDataGroupedByPlaceId = memoize(
  <T extends { placeId: string }>(data: T[]) => {
    return groupBy(data, "placeId");
  }
);

export const useThingsState = () => {
  const [data, setData] = useState<Thing[] | null | undefined>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isError, setIsError] = useState(false);

  const isLoading = !isError && !data;

  const dataById = calcDataById(data);
  const dataSortedByName = calcDataSortedByName(data);
  const dataSortedByNameKey = calcDataSortedByNameKey(dataSortedByName);
  const dataGroupedByPlaceId = calcDataGroupedByPlaceId(dataSortedByName);

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
    dataGroupedByPlaceId,
  };

  useThingsStateEffects(result);

  return result;
};
