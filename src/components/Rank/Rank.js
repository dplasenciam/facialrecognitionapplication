import React from "react";

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className="black f3 b">
        {`${name}, your current entry count is...`}
      </div>
      <div className="black f1 b">{entries}</div>
      <br />
    </div>
  );
};

export default Rank;
