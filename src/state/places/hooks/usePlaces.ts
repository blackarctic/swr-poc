import { omit, pick } from "lodash";

import { assertExtends } from "../../../utils/ts";
import { UsePlacesReqResult, UsePlacesStateResult } from "./types";
import { usePlacesReq } from "./usePlacesReq";
import { usePlacesState } from "./usePlacesState";
import { usePlacesReqToState } from "./usePlacesReqToState";
import { usePlacesMutateReqs } from "./usePlacesMutateReqs";

const picksOfResultOfUsePlacesReq = ["revalidate", "mutate"] as const;
const omitsOfResultOfUsePlacesState = [
  "setData",
  "setIsError",
  "setIsValidating",
] as const;

assertExtends<
  readonly Partial<keyof UsePlacesReqResult>[],
  typeof picksOfResultOfUsePlacesReq
>();
assertExtends<
  readonly Partial<keyof UsePlacesStateResult>[],
  typeof omitsOfResultOfUsePlacesState
>();

export const usePlaces = () => {
  const resultOfUsePlacesReq = usePlacesReq();
  const resultOfUsePlacesState = usePlacesState();
  usePlacesReqToState(resultOfUsePlacesReq, resultOfUsePlacesState);
  const resultOfUsePlacesMutateReqs = usePlacesMutateReqs(resultOfUsePlacesReq);

  const resultOfUsePlacesReqWithoutResData = pick(
    resultOfUsePlacesReq,
    picksOfResultOfUsePlacesReq
  );

  const resultOfUsePlacesStateWithoutSetters = omit(
    resultOfUsePlacesState,
    omitsOfResultOfUsePlacesState
  );

  return {
    ...resultOfUsePlacesReqWithoutResData,
    ...resultOfUsePlacesStateWithoutSetters,
    ...resultOfUsePlacesMutateReqs,
  };
};
