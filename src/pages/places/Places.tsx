import React from "react";

import { PlacesListMessages } from "./PlacesListMessages";
import { PlacesList } from "./PlacesList";
import { PlacesListToolbar } from "./PlacesListToolbar";
import { PlacesEditModal } from "./PlacesEditModal";
import { PlacesAddModal } from "./PlacesAddModal";

export const Places = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Places</h1>
        <div>
          <PlacesListToolbar />
        </div>
      </div>
      <PlacesListMessages />
      <PlacesList />
      <PlacesEditModal />
      <PlacesAddModal />
    </div>
  );
};
