import React from "react";

const Checkbox = (props) => {
  const { type, handleChange } = props;

  return (
    <div className="checkbox-container">
      <input
        className="box"
        id={type}
        type="checkbox"
        value={type}
        onChange={(event) => handleChange(event.target.value)}
      />
      <label>{type}</label>
    </div>
  );
};
export default Checkbox;
