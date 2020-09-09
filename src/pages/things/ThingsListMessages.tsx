import React from "react";

import { useClearMessagesOnMount } from "../../state/messages";
import { Messages } from "../../components/Messages";

export const ThingsListMessages = React.memo(() => {
  useClearMessagesOnMount();
  return <Messages />;
});
