import { Item, Box } from "../types";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ItemComponent } from "./Item";

export function BoxContents(props: {
  box: Box;
  onRemoveItem: (box: Box, item: Item) => void;
  onEditItem: (box: Box, item: Item, edited: Item) => void;
  onAddItem: (item: Item) => void;
}) {
  const { box, onRemoveItem, onEditItem, onAddItem } = props;
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="box-contents">
      <h3
        className="box-contents-name"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        Box {box.number}
        {showMenu ? (
          <div className="box-contents-item-controls">
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => onAddItem({ name: "Nuevo" })}
              className="box-contents-item-control add"
            ></FontAwesomeIcon>
          </div>
        ) : (
          ""
        )}
      </h3>
      <ul className="box-contents-list">
        {box.items.map((item, i) => (
          <ItemComponent
            item={item}
            key={`box-contents-item-${box.number}-${i}`}
            onRemove={() => onRemoveItem(box, item)}
            onEdit={newItem => onEditItem(box, item, newItem)}
          ></ItemComponent>
        ))}
      </ul>
    </div>
  );
}
