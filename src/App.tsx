import React, { useState, useEffect } from "react";
import "./App.css";

const Filter = () => {
  const [value, setValue] = useState("");
  return (
    <div className="filter">
      <input
        className="filter-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="bananas..."
      ></input>
      <button className="filter-clear-button" onClick={() => setValue("")}>
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

  useEffect(() => {
    fetch(backendUrl + "/boxes")
      .then(response => response.json())
      .then(array => array.sort((b1: any, b2: any) => b1.number - b2.number))
      .then(boxes => setBoxes(boxes));
  }, []);

  return (
    <div className="container">
      <header className="header">
        <Filter></Filter>
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
        {boxes === undefined ? (
          <div className="boxes-loading">loading...</div>
        ) : (
          boxes.map(box => (
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
