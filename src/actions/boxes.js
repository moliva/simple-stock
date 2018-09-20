import fetch from 'isomorphic-fetch'

export function loadBoxes() {
  return { 
    type: 'BOXES', 
    payload: fetch(process.env.BACKEND_URL + '/boxes')
              .then(response => response.json())
              .then(array => array.sort((b1, b2) => b1.number - b2.number))
  }
}

export function updateItem(editing) {
  return { 
    type: 'ITEM_UPDATE', 
    payload: fetch(`${process.env.BACKEND_URL}/boxes/${editing.box}/items/${editing.item}`,
                { 
                  method: 'PUT', 
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ name: editing.name })
                })
                .then(response =>  {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => editing)
  }
}

export function removeItem(editing) {
  return { 
    type: 'ITEM_DELETE', 
    payload: fetch(`${process.env.BACKEND_URL}/boxes/${editing.box}/items/${editing.item}`, { method: 'DELETE' })
                .then(response =>  {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => editing)
  }
}

export function createItem(boxNumber, item) {
  return { 
    type: 'ITEM_CREATE', 
    payload: fetch(`${process.env.BACKEND_URL}/boxes/${boxNumber}/items`, 
                { 
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(item)
                })
                .then(response =>  {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response;
                })
                .then(response => ({ boxNumber, item }))
  }
}
