import React, { useState, useEffect } from "react";
import Fuse from "fuse-js-latest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEraser,
  faTrashAlt,
  faEdit,
  faPlus,
  faBan,
  faCheck
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

const Filter = (props: { onChange: (value: string) => void }) => {
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

const backendUrl = "https://simple-stock-service.herokuapp.com";

type Box = {
  number: number;
  items: Item[];
};

type Item = {
  name: string;
};

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<undefined | Box[]>(undefined);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(backendUrl + "/boxes")
      .then(response => response.json())
      .then(array => array.sort((b1: any, b2: any) => b1.number - b2.number))
      .then(boxes => setBoxes(boxes));
  }, []);

  function isBlank(str: string) {
    return !str || /^\s*$/.test(str);
  }

  function filterContent<T>(boxes: T[], filter: string) {
    const options = {
      shouldSort: true,
      findAllMatches: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name", "items.name"]
    };
    const fuse = new Fuse(boxes, options);
    return fuse.search<T>(filter);
  }

  function removeItem(box: Box, item: Item) {
    fetch(
      `${backendUrl}/boxes/${box.number}/items/${boxes!
        .find(b => b.number === box.number)!
        .items.indexOf(item)}`,
      { method: "DELETE" }
    ).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      setBoxes(
        boxes?.map(current =>
          current.number === box.number
            ? { ...current, items: current.items.filter(it => it !== item) }
            : current
        )
      );
    });
  }

  function editItem(box: Box, old: Item, edited: Item) {
    fetch(
      `${backendUrl}/boxes/${box.number}/items/${boxes!
        .find(b => b.number === box.number)!
        .items.indexOf(old)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(edited)
      }
    ).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      setBoxes(
        boxes?.map(current =>
          current.number === box.number
            ? {
                ...current,
                items: current.items.map(it => (it === old ? edited : it))
              }
            : current
        )
      );
    });
  }

  function addItem(box: Box, item: Item) {
    fetch(`${backendUrl}/boxes/${box.number}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    }).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      setBoxes(
        boxes?.map(current =>
          current === box ? { ...box, items: [...box.items, item] } : current
        )
      );
    });
  }

  let toShow: Box[] | undefined;

  if (boxes) {
    toShow = isBlank(filter)
      ? boxes
      : boxes?.map(box => ({
          ...box,
          items: filterContent(box.items, filter)
        }));

    toShow = isBlank(filter) ? toShow : filterContent(toShow, filter);
  }

  return (
    <div className="container">
      <header className="header">
        <Filter onChange={value => setFilter(value)}></Filter>
        <div className="boxes">
          {boxes === undefined ? (
            <div className="boxes-loading">loading...</div>
          ) : (
            boxes.map(box => (
              <button
                key={`box-${box.number}`}
                className={`box box-${box.number}`}
              >
                {box.number}
              </button>
            ))
          )}
        </div>
      </header>
      <main className="main">
        {toShow === undefined ? (
          <div className="boxes-loading">loading...</div>
        ) : (
          toShow.map((box: Box) => (
            <Box
              box={box}
              key={`box-contents-${box.number}`}
              onRemoveItem={removeItem}
              onEditItem={(box, item, edited) => editItem(box, item, edited)}
              onAddItem={item => addItem(box, item)}
            ></Box>
          ))
        )}
      </main>
    </div>
  );
};

function Box(props: {
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
          <Item
            item={item}
            key={`box-contents-item-${box.number}-${i}`}
            onRemove={() => onRemoveItem(box, item)}
            onEdit={newItem => onEditItem(box, item, newItem)}
          ></Item>
        ))}
      </ul>
    </div>
  );
}

function Item(props: {
  item: Item;
  onRemove: () => void;
  onEdit: (newItem: Item) => void;
}) {
  const { item } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);

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
              onClick={() => {
                props.onEdit({ ...item, name: value });
                setEditing(false);
              }}
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

export default App;
