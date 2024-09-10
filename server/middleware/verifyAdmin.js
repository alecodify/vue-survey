const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ status: "Failed", error: "Unauthorized Access" });
  }
};

export default verifyAdmin;
