export function catchError(callBack) {
  return (req, res, next) => {
    callBack(req, res, next).catch((err) => {
      next(err);
    });
  };
}
