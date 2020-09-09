import { omit, pick } from "lodash";

import { assertExtends } from "../../../utils/ts";
import { UseThingsReqResult, UseThingsStateResult } from "./types";
import { useThingsReq } from "./useThingsReq";
import { useThingsState } from "./useThingsState";
import { useThingsReqToState } from "./useThingsReqToState";
import { useThingsMutateReqs } from "./useThingsMutateReqs";

const picksOfResultOfUseThingsReq = ["revalidate", "mutate"] as const;
const omitsOfResultOfUseThingsState = [
  "setData",
  "setIsError",
  "setIsValidating",
] as const;

assertExtends<
  readonly Partial<keyof UseThingsReqResult>[],
  typeof picksOfResultOfUseThingsReq
>();
assertExtends<
  readonly Partial<keyof UseThingsStateResult>[],
  typeof omitsOfResultOfUseThingsState
>();

export const useThings = () => {
  const resultOfUseThingsReq = useThingsReq();
  const resultOfUseThingsState = useThingsState();
  useThingsReqToState(resultOfUseThingsReq, resultOfUseThingsState);
  const resultOfUseThingsMutateReqs = useThingsMutateReqs(resultOfUseThingsReq);

  const resultOfUseThingsReqWithoutResData = pick(
    resultOfUseThingsReq,
    picksOfResultOfUseThingsReq
  );

  const resultOfUseThingsStateWithoutSetters = omit(
    resultOfUseThingsState,
    omitsOfResultOfUseThingsState
  );

  return {
    ...resultOfUseThingsReqWithoutResData,
    ...resultOfUseThingsStateWithoutSetters,
    ...resultOfUseThingsMutateReqs,
  };
};
