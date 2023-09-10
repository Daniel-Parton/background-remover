export const capitalizeWords = (text: string) => {
  return !text ? text : text.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};
