import { useThings } from "./useThings";
import { useThingsReq } from "./useThingsReq";
import { useThingsState } from "./useThingsState";

export type UseThingsResult = ReturnType<typeof useThings>;
export type UseThingsReqResult = ReturnType<typeof useThingsReq>;
export type UseThingsStateResult = ReturnType<typeof useThingsState>;
