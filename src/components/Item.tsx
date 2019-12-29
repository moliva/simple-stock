import { Item } from "../types";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faTrashAlt,
  faEdit
} from "@fortawesome/free-solid-svg-icons";

export function ItemComponent(props: {
  item: Item;
  onRemove: () => void;
  onEdit: (newItem: Item) => void;
}) {
  const { item } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);

  function confirm() {
    props.onEdit({ ...item, name: value });
    setEditing(false);
  }

  return (
    <li
      className="box-contents-item"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {editing ? (
        <input
          className="edit-input"
          value={value}
          autoFocus={true}
          onKeyDown={ev => {
            if (ev.keyCode === 13) {
              confirm();
            }
          }}
          onChange={e => setValue(e.target.value)}
        ></input>
      ) : (
        item.name
      )}
      {showMenu ? (
        editing ? (
          <div className="box-contents-item-controls">
            <FontAwesomeIcon
              icon={faBan}
              onClick={() => {
                setEditing(false);
              }}
              className="box-contents-item-control remove"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheck}
              onClick={() => confirm()}
              className="box-contents-item-control confirm"
            ></FontAwesomeIcon>
          </div>
        ) : (
          <div className="box-contents-item-controls">
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={props.onRemove}
              className="box-contents-item-control remove"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => {
                setValue(item.name);
                setEditing(true);
              }}
              className="box-contents-item-control edit"
            ></FontAwesomeIcon>
          </div>
        )
      ) : (
        ""
      )}
    </li>
  );
}
