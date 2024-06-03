import React from "react";
import NavBar from "./NavBar";
import CallProgress from "./CallProgress";

const CallCenter = ({ calls }) => {
  console.log("calls => ", calls);

  return (
    <div>
      <NavBar />
      {calls.calls.map((call, index) => (
        <CallProgress call={call} />
      ))}
    </div>
  );
};

export default CallCenter;
