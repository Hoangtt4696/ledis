export default (err, req, res, next) => {
  const error = err || {};
  const response = {
    success: false,
    message: error.message,
    data: null,
  };

  res.status(error.status || 400).json(response);
};
