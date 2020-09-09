import React from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import { ListGroup } from "reactstrap";

import { Loading } from "../../components/Loading";
import { usePlaces, UsePlacesResult } from "../../state/places";
import { PlacesListItem } from "./PlacesListItem";
import { useThings, UseThingsResult } from "../../state/things";

export type Props = {
  removePlace: UsePlacesResult["removePlace"];
  isError: UsePlacesResult["isError"];
  data: UsePlacesResult["data"];
  dataSortedByName: UsePlacesResult["dataSortedByName"];
  dataSortedByNameKey: UsePlacesResult["dataSortedByNameKey"];
  isLoading: UsePlacesResult["isLoading"];
  thingsGroupedByPlaceId: UseThingsResult["dataGroupedByPlaceId"];
};

export const PlacesListRaw: React.FC<Props> = React.memo(
  ({
    removePlace,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
    thingsGroupedByPlaceId,
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
          <PlacesListItem
            place={x}
            removePlace={removePlace}
            thingsCount={
              thingsGroupedByPlaceId[x.id]
                ? thingsGroupedByPlaceId[x.id].length
                : 0
            }
          />
        </Flipped>
      ))
    ) : (
      <div className="text-center">No places found</div>
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

export const PlacesList: React.FC = React.memo(() => {
  const {
    removePlace,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
  } = usePlaces();
  const { dataGroupedByPlaceId: thingsGroupedByPlaceId } = useThings();
  const props: Props = {
    removePlace,
    isError,
    data,
    dataSortedByName,
    dataSortedByNameKey,
    isLoading,
    thingsGroupedByPlaceId,
  };
  return <PlacesListRaw {...props} />;
});
