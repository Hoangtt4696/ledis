export default (success, data, error) => {
  const response = {
    success,
    message: error ? `Error: ${error.message || error}` : null,
    data: data !== undefined ? data : null,
  };

  return response;
};
