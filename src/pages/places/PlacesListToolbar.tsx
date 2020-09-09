import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync, faPlus } from "@fortawesome/free-solid-svg-icons";

import { usePlaces, UsePlacesResult } from "../../state/places";

export type Props = {
  revalidate: UsePlacesResult["revalidate"];
  isValidating: UsePlacesResult["isValidating"];
  isLoading: UsePlacesResult["isLoading"];
};

export const PlacesListToolbarRaw: React.FC<Props> = ({
  isValidating,
  isLoading,
  revalidate,
}) => {
  const history = useHistory();
  const onAddClick = useCallback(() => history.push("/places/add"), [history]);

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

export const PlacesListToolbar: React.FC = React.memo(() => {
  const { isValidating, isLoading, revalidate } = usePlaces();
  const props: Props = { isValidating, isLoading, revalidate };
  return <PlacesListToolbarRaw {...props} />;
});
