const operations = [];

export const registerOperation = (operation) => {
  operations.push(operation);
};

export const listOperations = () => [...operations];
