type ThingBase = {
  placeId: string;
  name: string;
};

export type Thing = {
  id: string;
} & ThingBase;

export type NewThing = {
  id?: string;
} & ThingBase;
