import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignIn,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

import queryString from "query-string";

import Fuse from "fuse-js-latest";

import { Box, Item } from "./types";
import { BoxContents } from "./components/BoxContents";
import { Filter } from "./components/Filter";
import { Boxes } from "./components/Boxes";
import { Spin } from "./components/Spin";

import "./styles/App.css";

const API_HOST = process.env.REACT_APP_API_URL ?? "http://localhost:9000";

type Action = { type: string; payload: any };

type IdentityState = { identity: any; token: string } | undefined;

const identityReducer = (state: any = {}, action: Action): IdentityState => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return undefined;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [identity, dispatch] = useReducer(identityReducer, undefined);
  const [picture, setPicture] = useState<string | undefined>();

  const [boxes, setBoxes] = useState<undefined | Box[]>(undefined);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!identity) {
      setBoxes(undefined);
      setFilter("");
      setSelected(null);
      setPicture(undefined);
      return;
    }

    const fetchPicture = async () => {
      const response = await fetch(identity.identity.picture, {
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          Accept: "image/*",
          Authorization: identity.token,
        },
      });

      const image = await response.text();

      setPicture(image);
    };

    fetchPicture().catch(console.error);
  }, [identity]);

  useEffect(() => {
    if (!identity) {
      // only do stuff when identity is set
      return;
    }

    // fetch(backendUrl + "/boxes")
    fetch(API_HOST + "/boxes", {
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "image/*",
        Authorization: identity.token,
      },
    })
      .then((response) => response.json())
      .then((array) => array.sort((b1: any, b2: any) => b1.number - b2.number))
      .then((boxes) => setBoxes(boxes))
      .catch(console.error);
  }, [identity]);

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
      keys: ["name", "items.name"],
    };
    const fuse = new Fuse(boxes, options);

    return fuse.search<T>(filter);
  }

  function removeItem(box: Box, item: Item) {
    const itemIndex = boxes!
        .find((b) => b.number === box.number)!
        .items.indexOf(item);
    backendFetch(
      `/boxes/${box.number}/items/${itemIndex}`,
      {
        method: "DELETE",
        identity,
      }
    ).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      setBoxes(
        boxes?.map((current) =>
          current.number === box.number
            ? { ...current, items: current.items.filter((it) => it !== item) }
            : current
        )
      );
    });
  }

  function editItem(box: Box, old: Item, edited: Item) {
    const itemIndex = boxes!
        .find((b) => b.number === box.number)!
        .items.indexOf(old);

    backendFetch(
      `/boxes/${box.number}/items/${itemIndex}`,
      {
        method: "PUT",
        identity,
        body: JSON.stringify(edited),
      }
    ).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      setBoxes(
        boxes?.map((current) =>
          current.number === box.number
            ? {
                ...current,
                items: current.items.map((it) => (it === old ? edited : it)),
              }
            : current
        )
      );
    });
  }

  type BackendFetchOptions = { method?: string | undefined, identity: IdentityState, body?: string | undefined };

  function backendFetch(path: string, { method, identity, body }: BackendFetchOptions) {
    return fetch(`${API_HOST}${path}`, {
      method,
      headers: {
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        Authorization: identity!.token,
        "Content-Type": "application/json",
      },
      body,
    })
  }

  function addItem(box: Box, item: Item) {
    backendFetch(`/boxes/${box.number}/items`, { method: "POST", identity, body: JSON.stringify(item) })
      .then((response) => {
       if (!response.ok) {
         throw Error(response.statusText);
       }

       setBoxes(
         boxes?.map((current) =>
           current === box ? { ...box, items: [...box.items, item] } : current
         )
       );
    });
  }

  let toShow: Box[] | undefined;

  if (boxes) {
    // filter on;ly by the box selected if any
    toShow = selected ? boxes.filter((box) => box.number === selected) : boxes;

    // filter items in boxes if filter is active
    toShow = isBlank(filter)
      ? toShow
      : toShow.map((box) => ({
          ...box,
          items: filterContent(box.items, filter),
        }));

    // filter only boxes with content if filter active
    toShow = isBlank(filter) ? toShow : filterContent(toShow, filter);
  }

  return (
    <section className="container">
      <BrowserRouter>
        <header className="header">
          <div className="navs">
            <Nav identity={identity} dispatch={dispatch} />
            <div className="nav-bar">
              <Filter onChange={(value) => setFilter(value)}></Filter>
              {boxes === undefined ? (
                <Spin />
              ) : (
                <Boxes
                  boxes={boxes}
                  onBoxSelected={(selected) => setSelected(selected)}
                ></Boxes>
              )}
            </div>
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
                onAddItem={(item) => addItem(box, item)}
              ></BoxContents>
            ))
          )}
        </main>
      </BrowserRouter>
    </section>
  );
};

const Nav = (props: { identity: IdentityState; dispatch: any }) => {
  const navigate = useNavigate();

  const identity = props.identity;

  const queryArguments = queryString.parse(globalThis.location.search);

  const token = queryArguments.login_success;
  if (!identity && typeof token === "string") {
    const idToken = token.split(".")[1];
    const decoded = atob(idToken);
    const identity = JSON.parse(decoded);

    props.dispatch({ type: "login", payload: { identity, token } });
    navigate("/");
  }

  return (
    <nav className="nav">
      {identity ? (
        <div className="profile-card right">
          <div style={{width: "100%", flexGrow: 1}}></div>
          <FontAwesomeIcon
            icon={faSignOut}
            onClick={() => {
               props.dispatch({ type: "logout" });
               navigate(`/`);
             }}
             className="button tiny"
           ></FontAwesomeIcon>
          {//<span className="nav-name">{identity.identity.email}</span>
          }
          <img
            className="profile-picture tiny"
            src={identity.identity.picture}
            crossOrigin="anonymous"
            alt="profile"
          ></img>
        </div>
      ) : (
        <div className="profile-card right">
          <div style={{width: "100%", flexGrow: 1}}></div>
          <a href={`${API_HOST}/login`}>
           <FontAwesomeIcon
               icon={faSignIn}
               className="button tiny"
           />
        </a>
        </div>
      )}
    </nav>
  );
};

export default App;
