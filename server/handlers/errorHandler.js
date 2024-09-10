const errorHandler = (error, req, res, next) => {
  if (error) {
    if (error.message) {
      return res.status(400).json({ status: "Failed", error: error.message });
    } else {
      return res.status(400).json({ status: "Failed", error: error });
    }
  } else {
    next();
  }
};

export default errorHandler;
