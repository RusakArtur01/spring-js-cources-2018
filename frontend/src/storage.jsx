export const data = (() => {
  let storage = [];
  if (!localStorage.getItem('todos')) {
    return storage;
  }
  return storage = JSON.parse(localStorage.getItem('todos'));
})();