type PlaceBase = {
  orgId: string;
  name: string;
};

export type Place = {
  id: string;
} & PlaceBase;

export type NewPlace = {
  id?: string;
} & PlaceBase;
