import React, { useState, useEffect } from "react";
import Fuse from "fuse-js-latest";

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
        x
      </button>
    </div>
  );
};

const backendUrl = "https://simple-stock-service.herokuapp.com";

type Box = {
  number: number;
  items: { name: string }[];
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

  function filterContent(boxes: Box["items"], filter: string) {
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
    return fuse.search(filter);
  }

  let toShow: any = isBlank(filter)
    ? boxes
    : boxes?.map(box => ({
        number: box.number,
        items: filterContent(box.items, filter)
      }));
  toShow = isBlank(filter) ? toShow : filterContent(toShow, filter);

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
            <div className="box-contents" key={`box-contents-${box.number}`}>
              <h3 className="box-contents-name">Box {box.number}</h3>
              <ul className="box-contents-list">
                {box.items.map((item, i) => (
                  <li
                    key={`box-contents-item-${box.number}-${i}`}
                    className="box-contents-item"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default App;
