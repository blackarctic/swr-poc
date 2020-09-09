import React from "react";
import { Spinner } from "reactstrap";

export const Loading: React.FC = () => {
  return (
    <div className="w-100 d-flex justify-content-center">
      <Spinner />
    </div>
  );
};
