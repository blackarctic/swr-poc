import React, { useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ListGroupItem, Button, Badge } from "reactstrap";
import { useBoolean } from "ahooks";
import omit from "lodash/omit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useHighlightOnChange } from "../../hooks/useHighlightOnChange";
import { Thing } from "../../state/things";
import { Place } from "../../state/places";

export type Props = {
  thing: Thing;
  place?: Place;
  removeThing: (id: string) => void;
};

export const ThingsListItem: React.FC<Props> = React.memo((props) => {
  const { thing, place, removeThing } = props;

  const history = useHistory();

  const isHighlighted = useHighlightOnChange([
    thing.id,
    thing.name,
    thing.placeId,
  ]);
  const [isFocused, { setTrue: setFocused, setFalse: setBlurred }] = useBoolean(
    false
  );

  const thingId = thing.id;
  const onEditClick = useCallback(
    () => history.push(`/things/${thingId}/edit`),
    [history, thingId]
  );
  const onDeleteClick = useCallback(() => {
    removeThing(thingId);
  }, [removeThing, thingId]);

  const extraProps = useMemo(() => {
    return omit(props, ["children", "thing", "removeThing"]);
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
        <div>{thing.name}</div>
        <Badge color="secondary" className="mr-2">
          {place && place.name}
        </Badge>
      </div>
      {controlPanel}
    </ListGroupItem>
  );
});
