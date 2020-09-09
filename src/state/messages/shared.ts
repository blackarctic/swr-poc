import { v4 as generateUuid } from "uuid";

export const DATA_LOAD_ERROR_MESSAGES = (() => {
  const ID = generateUuid();

  const REFRESH = {
    id: ID,
    color: "danger",
    message: "Unable to refresh data",
  };

  const LOAD = {
    id: ID,
    color: "danger",
    message: "Unable to load data",
  };

  return {
    ID,
    REFRESH,
    LOAD,
  };
})();
