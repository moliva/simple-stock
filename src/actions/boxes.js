import fetch from 'isomorphic-fetch'

export function loadBoxes() {
  return { 
    type: 'BOXES', 
    payload: fetch(process.env.BACKEND_URL + '/boxes')
              .then(response => response.json())
              .then(array => array.sort((b1, b2) => b1.number - b2.number))
    
    // type: 'BOXES_FULFILLED',
    // payload: [
    //   { number: 1, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 2, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 3, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 4, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 5, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 6, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 7, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    //   { number: 8, items: [ { name: 'azucar' }, { name: 'sal'}, { name: 'canela'} ] },
    // ]
  }
}
