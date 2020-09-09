import { omit, pick } from "lodash";

import { assertExtends } from "../../../utils/ts";
import { UseOrgsReqResult, UseOrgsStateResult } from "./types";
import { useOrgsReq } from "./useOrgsReq";
import { useOrgsState } from "./useOrgsState";
import { useOrgsReqToState } from "./useOrgsReqToState";

const picksOfResultOfUseOrgsReq = ["revalidate", "mutate"] as const;
const omitsOfResultOfUseOrgsState = [
  "setData",
  "setIsError",
  "setIsValidating",
] as const;

// Assert that the above "picks" and "omits" are actually keys of their respective objects.
//
// Why?
// Try commenting them out and replacing "revalidate" above with "donuts".
// No TS error? App compiles just fine? That's why.
assertExtends<
  readonly Partial<keyof UseOrgsReqResult>[],
  typeof picksOfResultOfUseOrgsReq
>();
assertExtends<
  readonly Partial<keyof UseOrgsStateResult>[],
  typeof omitsOfResultOfUseOrgsState
>();

export const useOrgs = () => {
  const resultOfUseOrgsReq = useOrgsReq();
  const resultOfUseOrgsState = useOrgsState();
  useOrgsReqToState(resultOfUseOrgsReq, resultOfUseOrgsState);

  const resultOfUseOrgsReqWithoutResData = pick(
    resultOfUseOrgsReq,
    picksOfResultOfUseOrgsReq
  );

  const resultOfUseOrgsStateWithoutSetters = omit(
    resultOfUseOrgsState,
    omitsOfResultOfUseOrgsState
  );

  return {
    ...resultOfUseOrgsReqWithoutResData,
    ...resultOfUseOrgsStateWithoutSetters,
  };
};
