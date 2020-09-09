import React, { useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ListGroupItem, Button, Badge } from "reactstrap";
import { useBoolean } from "ahooks";
import omit from "lodash/omit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useHighlightOnChange } from "../../hooks/useHighlightOnChange";
import { Place } from "../../state/places";

export type Props = {
  place: Place;
  thingsCount: number;
  removePlace: (id: string) => void;
};

export const PlacesListItem: React.FC<Props> = React.memo((props) => {
  const { place, thingsCount, removePlace } = props;

  const history = useHistory();

  const isHighlighted = useHighlightOnChange([
    place.id,
    place.name,
    thingsCount,
  ]);
  const [isFocused, { setTrue: setFocused, setFalse: setBlurred }] = useBoolean(
    false
  );

  const placeId = place.id;
  const onEditClick = useCallback(
    () => history.push(`/places/${placeId}/edit`),
    [history, placeId]
  );
  const onDeleteClick = useCallback(() => {
    removePlace(placeId);
  }, [removePlace, placeId]);

  const extraProps = useMemo(() => {
    return omit(props, ["children", "place", "removePlace", "thingsCount"]);
  }, [props]);

  const controlPanel = isFocused ? (
    <div>
      <Button color="info" className="ml-2" onClick={onEditClick}>
        <FontAwesomeIcon icon={faEdit} />
      </Button>
      <Button color="danger" className="ml-2" onClick={onDeleteClick}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  ) : null;

  const badgeCount = thingsCount;
  const badgeLabel = badgeCount === 1 ? "item" : "items";
  const badgeContent = `${badgeCount} ${badgeLabel}`;

  return (
    <ListGroupItem
      onFocus={setFocused}
      onBlur={setBlurred}
      onMouseOver={setFocused}
      onMouseLeave={setBlurred}
      className="transitional-list-item d-flex justify-content-between align-items-center"
      color={isHighlighted ? "warning" : "default"}
      {...extraProps}
    >
      <div>
        <div>{place.name}</div>
        <Badge color="secondary" className="mr-2">
          {badgeContent}
        </Badge>
      </div>
      {controlPanel}
    </ListGroupItem>
  );
});
