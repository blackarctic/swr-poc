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

import { useThings, UseThingsResult } from "../../state/things";
import { usePlaces, UsePlacesResult } from "../../state/places";

type PathMatch = match<{
  thingId: string;
}> | null;

export type Props = {
  pathMatch: PathMatch;
  dataById: UseThingsResult["dataById"];
  placesSortedByName: UsePlacesResult["dataSortedByName"];
  updateThing: UseThingsResult["updateThing"];
};

const usePathMatch = (): PathMatch => {
  const location = useLocation();
  return matchPath<{ thingId: string }>(location.pathname, {
    path: "/things/:thingId/edit",
  });
};

export const ThingsEditModalRaw: React.FC<Props> = React.memo(
  ({ pathMatch, dataById, placesSortedByName, updateThing }) => {
    const history = useHistory();

    const currThingId = pathMatch && pathMatch.params.thingId;
    const prevThingId = usePrevious(currThingId);

    // Persist the previous selection to prevent jolt when the modal is closing.
    const thingId = currThingId || prevThingId || null;
    const thing = thingId ? dataById[thingId] : null;

    const thingName = thing ? thing.name : null;
    const thingPlaceId = thing ? thing.placeId : null;

    const [thingDraftName, setThingDraftName] = useState("");
    const [thingDraftPlaceId, setThingDraftPlaceId] = useState("");

    const close = useCallback(() => {
      history.push("/things");
    }, [history]);

    const onOpened = useCallback(() => {
      setThingDraftName(thingName || "");
      setThingDraftPlaceId(thingPlaceId || "");

      const firstInputElement = document.querySelector<HTMLFormElement>(
        "#editThingName"
      );
      if (firstInputElement) {
        firstInputElement.focus();
      }
    }, [thingName, thingPlaceId]);

    const onThingDraftNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setThingDraftName(event.target.value);
      },
      []
    );

    const onThingDraftPlaceIdChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setThingDraftPlaceId(event.target.value);
      },
      []
    );

    const isThingDraftNameValid = useMemo(() => {
      return thingDraftName !== "";
    }, [thingDraftName]);

    const isThingDraftPlaceIdValid = useMemo(() => {
      return thingDraftPlaceId !== "";
    }, [thingDraftPlaceId]);

    const onSubmit = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (thing && isThingDraftNameValid && isThingDraftPlaceIdValid) {
          const name = thingDraftName.trim();
          const placeId = thingDraftPlaceId;
          updateThing({ ...thing, name, placeId });
          close();
        }
      },
      [
        updateThing,
        close,
        thingDraftName,
        thingDraftPlaceId,
        thing,
        isThingDraftNameValid,
        isThingDraftPlaceIdValid,
      ]
    );

    const placeOptions = useMemo(
      () => [
        <option key={""} value={""}>
          --
        </option>,
        ...placesSortedByName.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        )),
      ],
      [placesSortedByName]
    );

    return (
      <Modal isOpen={!!currThingId} toggle={close} onOpened={onOpened}>
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={close}>Edit Thing</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="editThingName">Name</Label>
              <Input
                type="text"
                id="editThingName"
                value={thingDraftName}
                onChange={onThingDraftNameChange}
                autoComplete="off"
                invalid={!isThingDraftNameValid}
              />
            </FormGroup>
            <FormGroup>
              <Label for="editThingPlaceId">Place</Label>
              <Input
                type="select"
                id="editThingPlaceId"
                value={thingDraftPlaceId}
                onChange={onThingDraftPlaceIdChange}
                autoComplete="off"
                invalid={!isThingDraftPlaceIdValid}
              >
                {placeOptions}
              </Input>
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

export const ThingsEditModal: React.FC = React.memo(() => {
  const pathMatch = usePathMatch();
  const { dataById, updateThing } = useThings();
  const { dataSortedByName: placesSortedByName } = usePlaces();
  const props: Props = { pathMatch, dataById, placesSortedByName, updateThing };
  return <ThingsEditModalRaw {...props} />;
});
