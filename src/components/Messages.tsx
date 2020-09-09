import React from "react";
import { Alert } from "reactstrap";

import { useMessages, isMessageVisible } from "../state/messages";

export const Messages: React.FC = () => {
  const { messages, dismissMessage } = useMessages();

  return (
    <div>
      {messages.map((x) => (
        <Alert
          key={x.id}
          color={x.color}
          isOpen={isMessageVisible(x)}
          toggle={() => dismissMessage(x.id)}
        >
          {x.message}
        </Alert>
      ))}
    </div>
  );
};
