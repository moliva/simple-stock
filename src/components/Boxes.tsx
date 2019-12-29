import { Box } from "../types";
import React, { useState } from "react";

export function Boxes(props: {
  boxes: Box[];
  onBoxSelected: (box: number | null) => void;
}) {
  const { boxes, onBoxSelected } = props;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="boxes">
      {boxes.map(box => (
        <button
          key={`box-${box.number}`}
          className={`box box-${box.number} ${
            selected === box.number ? "selected" : ""
          }`}
          onClick={() => {
            const current = selected === box.number ? null : box.number;
            setSelected(current);
            onBoxSelected(current);
          }}
        >
          {box.number}
        </button>
      ))}
    </div>
  );
}
