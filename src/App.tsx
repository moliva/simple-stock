import React, { useState, useEffect } from "react";
import Fuse from "fuse-js-latest";
import { Box, Item } from "./types";
import { BoxContents } from "./components/BoxContents";
import { Filter } from "./components/Filter";

import "./styles/App.css";

const backendUrl = "https://simple-stock-service.herokuapp.com";

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<undefined | Box[]>(undefined);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Box | null>(null);

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
    // filter on;ly by the box selected if any
    toShow = selected ? [selected] : boxes;

    // filter items in boxes if filter is active
    toShow = isBlank(filter)
      ? toShow
      : toShow.map(box => ({
          ...box,
          items: filterContent(box.items, filter)
        }));

    // filter only boxes with content if filter active
    toShow = isBlank(filter) ? toShow : filterContent(toShow, filter);
  }

  return (
    <div className="container">
      <header className="header">
        <Filter onChange={value => setFilter(value)}></Filter>
        {boxes === undefined ? (
          <div className="boxes-loading">loading...</div>
        ) : (
          <Boxes
            boxes={boxes}
            onBoxSelected={selected => setSelected(selected)}
          ></Boxes>
        )}
      </header>
      <main className="main">
        {toShow === undefined ? (
          <div className="boxes-loading">loading...</div>
        ) : toShow.length === 0 ? (
          <div className="boxes-empty">No hay nada que coincida :'(</div>
        ) : (
          toShow.map((box: Box) => (
            <BoxContents
              box={box}
              key={`box-contents-${box.number}`}
              onRemoveItem={removeItem}
              onEditItem={(box, item, edited) => editItem(box, item, edited)}
              onAddItem={item => addItem(box, item)}
            ></BoxContents>
          ))
        )}
      </main>
    </div>
  );
};

function Boxes(props: {
  boxes: Box[];
  onBoxSelected: (box: Box | null) => void;
}) {
  const { boxes, onBoxSelected } = props;
  const [selected, setSelected] = useState<Box | null>(null);

  return (
    <div className="boxes">
      {boxes.map(box => (
        <button
          key={`box-${box.number}`}
          className={`box box-${box.number}`}
          onClick={() => {
            const current = selected === box ? null : box;
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

export default App;
