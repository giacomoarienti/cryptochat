export const objectIsEmpty = (object) => {
  return object ? Object.keys(object).length === 0 : true;
}