export const data = (() => {
  let storage = [];
  if (!localStorage.getItem('list')) {
    return storage;
  }
  return storage = JSON.parse(localStorage.getItem('list'));
})();