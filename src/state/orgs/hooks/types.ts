import { useOrgs } from "./useOrgs";
import { useOrgsReq } from "./useOrgsReq";
import { useOrgsState } from "./useOrgsState";

export type UseOrgsResult = ReturnType<typeof useOrgs>;
export type UseOrgsReqResult = ReturnType<typeof useOrgsReq>;
export type UseOrgsStateResult = ReturnType<typeof useOrgsState>;
