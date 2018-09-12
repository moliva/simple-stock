import fetch from 'isomorphic-fetch'

// export const boxes_pending = createAction('BOXES_PENDING');
// export const boxes_fullfilled = createAction('BOXES_FULLFILLED');

export function loadBoxes() {
  return { 
    type: 'BOXES', 
    payload: fetch('http://rest.learncode.academy/api/moliva/boxes')
              .then(response => response.json())
              .then(array => array.sort((b1, b2) => b1.number - b2.number))
  }
}
