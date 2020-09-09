import { useEffect } from "react";

import { useOrgsState } from "../../orgs";
import { UseCurrentOrgStateResult } from "./types";

export const useCurrentOrgEffects = ({
  currentOrg,
  setCurrentOrgId,
}: UseCurrentOrgStateResult) => {
  const { dataSortedByName: orgsSortedByName } = useOrgsState();

  // Initialize the currentOrgId
  useEffect(() => {
    if (!currentOrg && orgsSortedByName && orgsSortedByName[0]) {
      setCurrentOrgId(orgsSortedByName[0].id);
    }
  }, [setCurrentOrgId, currentOrg, orgsSortedByName]);
};
