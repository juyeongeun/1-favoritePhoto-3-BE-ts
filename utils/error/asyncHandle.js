const asyncHandle = (handle) => (req, res, next) => {
  handle(req, res, next).catch(next);
};

export default asyncHandle;
