import React, { useCallback, useState, useMemo } from "react";
import { useHistory, useLocation, matchPath, match } from "react-router-dom";
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
import { useThings, UseThingsResult } from "../../state/things";
import { useMessages, UseMessagesResult } from "../../state/messages";

type PathMatch = match<{}> | null;

export type Props = {
  pathMatch: PathMatch;
  placesSortedByName: UsePlacesResult["dataSortedByName"];
  createThing: UseThingsResult["createThing"];
  displayMessage: UseMessagesResult["displayMessage"];
};

const usePathMatch = () => {
  const location = useLocation();
  return matchPath(location.pathname, {
    path: "/things/add",
  });
};

export const ThingsAddModalRaw: React.FC<Props> = React.memo(
  ({ pathMatch, placesSortedByName, createThing, displayMessage }) => {
    const history = useHistory();

    const [thingDraftName, setThingDraftName] = useState("");
    const [thingDraftPlaceId, setThingDraftPlaceId] = useState("");

    const [hasStartedThingDraftName, setHasStartedThingDraftName] = useState(
      false
    );
    const [hasStartedThingPlaceId, setHasStartedThingPlaceId] = useState(false);

    const close = useCallback(() => {
      history.push("/things");
    }, [history]);

    const onOpened = useCallback(() => {
      setThingDraftName("");
      setThingDraftPlaceId("");

      setHasStartedThingDraftName(false);
      setHasStartedThingPlaceId(false);

      const firstInputElement = document.querySelector<HTMLFormElement>(
        "#addThingName"
      );
      if (firstInputElement) {
        firstInputElement.focus();
      }
    }, []);

    const onThingDraftNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!hasStartedThingDraftName) {
          setHasStartedThingDraftName(true);
        }
        setThingDraftName(event.target.value);
      },
      [hasStartedThingDraftName]
    );

    const onThingDraftPlaceIdChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!hasStartedThingPlaceId) {
          setHasStartedThingPlaceId(true);
        }
        setThingDraftPlaceId(event.target.value);
      },
      [hasStartedThingPlaceId]
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
        setHasStartedThingDraftName(true);
        setHasStartedThingPlaceId(true);
        if (isThingDraftNameValid && isThingDraftPlaceIdValid) {
          const name = thingDraftName.trim();
          const placeId = thingDraftPlaceId;
          createThing({ name, placeId });
          close();
        }
      },
      [
        createThing,
        close,
        thingDraftName,
        thingDraftPlaceId,
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
      <Modal isOpen={!!pathMatch} toggle={close} onOpened={onOpened}>
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={close}>Add Thing</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="addThingName">Name</Label>
              <Input
                type="text"
                id="addThingName"
                value={thingDraftName}
                onChange={onThingDraftNameChange}
                autoComplete="off"
                invalid={hasStartedThingDraftName && !isThingDraftNameValid}
              />
            </FormGroup>
            <FormGroup>
              <Label for="addThingPlaceId">Place</Label>
              <Input
                type="select"
                id="addThingPlaceId"
                value={thingDraftPlaceId}
                onChange={onThingDraftPlaceIdChange}
                autoComplete="off"
                invalid={hasStartedThingPlaceId && !isThingDraftPlaceIdValid}
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

export const ThingsAddModal: React.FC = React.memo(() => {
  const pathMatch = usePathMatch();
  const { createThing } = useThings();
  const { dataSortedByName: placesSortedByName } = usePlaces();
  const { displayMessage } = useMessages();
  const props: Props = {
    pathMatch,
    placesSortedByName,
    createThing,
    displayMessage,
  };
  return <ThingsAddModalRaw {...props} />;
});
