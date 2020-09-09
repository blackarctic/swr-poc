import React, { useCallback } from "react";
import { FormGroup, Input } from "reactstrap";

import { useOrgs } from "../state/orgs";
import { useCurrentOrg } from "../state/currentOrg";

export const OrgSelect: React.FC = () => {
  const { data, isLoading, isError, dataSortedByName } = useOrgs();
  const { currentOrg, setCurrentOrgId } = useCurrentOrg();

  const onSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentOrgId(event.target.value);
    },
    [setCurrentOrgId]
  );

  if (!data && isError) {
    return (
      <FormGroup>
        <Input type="select" disabled invalid>
          <option>--</option>
        </Input>
      </FormGroup>
    );
  }

  if (isLoading || !currentOrg) {
    return (
      <FormGroup>
        <Input type="select" disabled>
          <option>Loading...</option>
        </Input>
      </FormGroup>
    );
  }

  return (
    <FormGroup>
      <Input type="select" onChange={onSelect} value={currentOrg.id}>
        {dataSortedByName.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
};
