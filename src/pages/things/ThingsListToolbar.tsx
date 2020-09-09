import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faPlus } from "@fortawesome/free-solid-svg-icons";

import { useThings, UseThingsResult } from "../../state/things";

export type Props = {
  revalidate: UseThingsResult["revalidate"];
  isValidating: UseThingsResult["isValidating"];
  isLoading: UseThingsResult["isLoading"];
};

export const ThingsListToolbarRaw: React.FC<Props> = ({
  isValidating,
  isLoading,
  revalidate,
}) => {
  const history = useHistory();
  const onAddClick = useCallback(() => history.push("/things/add"), [history]);

  return (
    <div>
      <Button
        disabled={isLoading}
        className="mr-2"
        onClick={onAddClick}
        color="primary"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <Button disabled={isValidating || isLoading} onClick={revalidate}>
        <FontAwesomeIcon spin={isValidating} icon={faSync} />
      </Button>
    </div>
  );
};

export const ThingsListToolbar: React.FC = React.memo(() => {
  const { isValidating, isLoading, revalidate } = useThings();
  const props: Props = { isValidating, isLoading, revalidate };
  return <ThingsListToolbarRaw {...props} />;
});
