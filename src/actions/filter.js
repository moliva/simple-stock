export function updateFilter(filter) {
  return { 
    type: 'FILTER_UPDATED', 
    payload: filter
  }
}
