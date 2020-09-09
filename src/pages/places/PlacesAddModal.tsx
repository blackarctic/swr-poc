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

import { useCurrentOrg, UseCurrentOrgResult } from "../../state/currentOrg";
import { usePlaces, UsePlacesResult } from "../../state/places";
import { useMessages, UseMessagesResult } from "../../state/messages";

type PathMatch = match<{}> | null;

export type Props = {
  pathMatch: PathMatch;
  currentOrg: UseCurrentOrgResult["currentOrg"];
  createPlace: UsePlacesResult["createPlace"];
  displayMessage: UseMessagesResult["displayMessage"];
};

const usePathMatch = () => {
  const location = useLocation();
  return matchPath(location.pathname, {
    path: "/places/add",
  });
};

export const PlacesAddModalRaw: React.FC<Props> = React.memo(
  ({ pathMatch, currentOrg, createPlace, displayMessage }) => {
    const history = useHistory();

    const [placeDraftName, setPlaceDraftName] = useState("");
    const [hasStartedPlaceDraftName, setHasStartedPlaceDraftName] = useState(
      false
    );

    const close = useCallback(() => {
      history.push("/places");
    }, [history]);

    const onOpened = useCallback(() => {
      setHasStartedPlaceDraftName(false);
      setPlaceDraftName("");

      const firstInputElement = document.querySelector<HTMLFormElement>(
        "#addPlaceName"
      );
      if (firstInputElement) {
        firstInputElement.focus();
      }
    }, []);

    const onPlaceDraftNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!hasStartedPlaceDraftName) {
          setHasStartedPlaceDraftName(true);
        }
        setPlaceDraftName(event.target.value);
      },
      [hasStartedPlaceDraftName]
    );

    const isPlaceDraftNameValid = useMemo(() => {
      return placeDraftName !== "";
    }, [placeDraftName]);

    const onSubmit = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!hasStartedPlaceDraftName) {
          setHasStartedPlaceDraftName(true);
        }
        if (isPlaceDraftNameValid) {
          const name = placeDraftName.trim();
          if (!currentOrg) {
            displayMessage({
              color: "danger",
              message: `Unable to add "${name}"`,
              shouldBeAutoDismissed: true,
            });
          } else {
            createPlace({ name, orgId: currentOrg.id });
          }
          close();
        }
      },
      [
        createPlace,
        displayMessage,
        close,
        currentOrg,
        hasStartedPlaceDraftName,
        placeDraftName,
        isPlaceDraftNameValid,
      ]
    );

    return (
      <Modal isOpen={!!pathMatch} toggle={close} onOpened={onOpened}>
        <Form onSubmit={onSubmit}>
          <ModalHeader toggle={close}>Add Place</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="addPlaceName">Name</Label>
              <Input
                type="text"
                id="addPlaceName"
                value={placeDraftName}
                onChange={onPlaceDraftNameChange}
                autoComplete="off"
                invalid={hasStartedPlaceDraftName && !isPlaceDraftNameValid}
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

export const PlacesAddModal: React.FC = React.memo(() => {
  const pathMatch = usePathMatch();
  const { currentOrg } = useCurrentOrg();
  const { createPlace } = usePlaces();
  const { displayMessage } = useMessages();
  const props: Props = { pathMatch, currentOrg, createPlace, displayMessage };
  return <PlacesAddModalRaw {...props} />;
});
