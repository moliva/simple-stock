import React, { useState, useEffect } from "react";
import Fuse from "fuse-js-latest";
import { Box, Item } from "./types";
import { BoxContents } from "./components/BoxContents";
import { Filter } from "./components/Filter";
import { Boxes } from "./components/Boxes";
import { Spin } from "./components/Spin";

import "./styles/App.css";

const backendUrl = "https://simple-stock-service.herokuapp.com";

const App: React.FC = () => {
  const [boxes, setBoxes] = useState<undefined | Box[]>(undefined);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

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
    toShow = selected ? boxes.filter(box => box.number === selected) : boxes;

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
    <section className="container">
      <header className="header">
        <div className="nav-bar">
          <Filter onChange={value => setFilter(value)}></Filter>
          {boxes === undefined ? (
            <Spin />
          ) : (
            <Boxes
              boxes={boxes}
              onBoxSelected={selected => setSelected(selected)}
            ></Boxes>
          )}
        </div>
      </header>
      <main className="main">
        {toShow === undefined ? (
          <Spin />
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
    </section>
  );
};

export default App;
