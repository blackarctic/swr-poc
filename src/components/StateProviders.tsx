import React from "react";

import { ProviderForUseMessages } from "../state/messages";
import { ProviderForUseOrgsState } from "../state/orgs";
import { ProviderForUsePlacesState } from "../state/places";
import { ProviderForUseCurrentOrgState } from "../state/currentOrg";

const providers = [
  ProviderForUseMessages,
  ProviderForUseOrgsState,
  ProviderForUseCurrentOrgState,
  ProviderForUsePlacesState,
];

export const StateProviders: React.FC = ({ children }) => {
  return providers.reduceRight(
    (acc, Curr) => <Curr>{acc}</Curr>,
    <>{children}</>
  );
};
