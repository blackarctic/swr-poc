import React from "react";

import { ThingsListMessages } from "./ThingsListMessages";
import { ThingsList } from "./ThingsList";
import { ThingsListToolbar } from "./ThingsListToolbar";
import { ThingsEditModal } from "./ThingsEditModal";
import { ThingsAddModal } from "./ThingsAddModal";

export const Things = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Things</h1>
        <div>
          <ThingsListToolbar />
        </div>
      </div>
      <ThingsListMessages />
      <ThingsList />
      <ThingsEditModal />
      <ThingsAddModal />
    </div>
  );
};
