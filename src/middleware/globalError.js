export const globalError = (err, req, res, next) => {
  let code = err.statusCode || 500;
  res.status(code).json({
    error: "err",
    message: err.message,
    code: err.statusCode,
    code,
    err: err.stack,
  });
};
