import { useState } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";

export const Filter = (props: { onChange: (value: string) => void }) => {
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);

  function onValueChanged(value: string) {
    setValue(value);
    props.onChange(value);
  }

  return (
    <div className="filter">
      <input
        className="filter-input"
        value={value}
        onChange={e => onValueChanged(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="bananas..."
      ></input>
      <button
        className={
          "filter-clear-button" + (focus ? " filter-clear-button-focus" : "")
        }
        onClick={() => onValueChanged("")}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
    </div>
  );
};
