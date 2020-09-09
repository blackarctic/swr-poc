import React, { useCallback, useState, useMemo } from "react";
import { useHistory, useLocation, matchPath, match } from "react-router-dom";
import { usePrevious } from "ahooks";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import { usePlaces, UsePlacesResult } from "../../state/places";

type PathMatch = match<{
  placeId: string;
}> | null;

export type Props = {
  pathMatch: PathMatch;
  dataById: UsePlacesResult["dataById"];
  updatePlace: UsePlacesResult["updatePlace"];
};

const usePathMatch = (): PathMatch => {
  const location = useLocation();
  return matchPath<{ placeId: string }>(location.pathname, {
    path: "/places/:placeId/edit",
  });
};

export const PlacesEditModalRaw: React.FC<Props> = React.memo(
  ({ pathMatch, dataById, updatePlace }) => {
    const history = useHistory();

    const currPlaceId = pathMatch && pathMatch.params.placeId;
    const prevPlaceId = usePrevious(currPlaceId);

    // Persist the previous selection to prevent jolt when the modal is closing.
    const placeId = currPlaceId || prevPlaceId || null;
    const place = placeId ? dataById[placeId] : null;

    const placeName = place ? place.name : null;

    const [placeDraftName, setPlaceDraftName] = useState("");

    const close = useCallback(() => {
      history.push("/places");
    }, [history]);

    const onOpened = useCallback(() => {
      setPlaceDraftName(placeName || "");

      const firstInputElement = document.querySelector<HTMLFormElement>(
        "#editPlaceName"
      );
      if (firstInputElement) {
        firstInputElement.focus();
      }
    }, [placeName]);

    const onPlaceDraftNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceDraftName(event.target.value);
      },
      []
    );

    const isPlaceDraftNameValid = useMemo(() => {
      return placeDraftName !== "";
    }, [placeDraftName]);

    const onSubmit = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (place && isPlaceDraftNameValid) {
          updatePlace({ ...place, name: placeDraftName.trim() });
          close();
        }
      },
      [updatePlace, close, placeDraftName, place, isPlaceDraftNameValid]
    );

    return (
      <Modal isOpen={!!currPlaceId} toggle={close} onOpened={onOpened}>
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={close}>Edit Place</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="editPlaceName">Name</Label>
              <Input
                type="text"
                id="editPlaceName"
                value={placeDraftName}
                onChange={onPlaceDraftNameChange}
                autoComplete="off"
                invalid={!isPlaceDraftNameValid}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Save
            </Button>{" "}
            <Button color="secondary" type="button" onClick={close}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
);

export const PlacesEditModal: React.FC = React.memo(() => {
  const pathMatch = usePathMatch();
  const { dataById, updatePlace } = usePlaces();
  const props: Props = { pathMatch, dataById, updatePlace };
  return <PlacesEditModalRaw {...props} />;
});
