import React from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import { ListGroup } from "reactstrap";

import { Loading } from "../../components/Loading";
import { useThings, UseThingsResult } from "../../state/things";
import { ThingsListItem } from "./ThingsListItem";
import { usePlaces, UsePlacesResult } from "../../state/places";

export type Props = {
  removeThing: UseThingsResult["removeThing"];
  isError: UseThingsResult["isError"];
  data: UseThingsResult["data"];
  dataSortedByName: UseThingsResult["dataSortedByName"];
  dataSortedByNameKey: UseThingsResult["dataSortedByNameKey"];
  isLoading: UseThingsResult["isLoading"];
  placesById: UsePlacesResult["dataById"];
};

export const ThingsListRaw: React.FC<Props> = React.memo(
  ({
    removeThing,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
    placesById,
  }) => {
    if (!data && isError) {
      return null;
    }

    if (isLoading) {
      return <Loading />;
    }

    const listItems = dataSortedByName.length ? (
      dataSortedByName.map((x) => (
        <Flipped key={x.id} flipId={x.id}>
          <ThingsListItem
            thing={x}
            removeThing={removeThing}
            place={placesById[x.placeId]}
          />
        </Flipped>
      ))
    ) : (
      <div className="text-center">No things found</div>
    );

    return (
      <div>
        <Flipper flipKey={dataSortedByNameKey}>
          <ListGroup>{listItems}</ListGroup>
        </Flipper>
      </div>
    );
  }
);

export const ThingsList: React.FC = React.memo(() => {
  const {
    removeThing,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
  } = useThings();
  const { dataById: placesById } = usePlaces();
  const props: Props = {
    removeThing,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
    placesById,
  };
  return <ThingsListRaw {...props} />;
});
