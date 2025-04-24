const WrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      console.log("WrapAsync triggered this error====>", err.message); // remove me
      return next(err);
    });
  };
};

export default WrapAsync;
