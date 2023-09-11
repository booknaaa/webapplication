
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      next();
    } else {
      res.redirect("/login");
      //res.status(401).json({ error: 'Unauthorized' });
    }
  };

const redirectIfAuth = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/home")
    //res.json({ message: 'successful' });
    } else{
      next();
    }
  };

  const AuthAdmin = (req, res, next) => {
    if (req.session.userId) {
      if (user.role === "Admin") {
      next();
    } else {
      res.redirect("/login");
      //res.status(401).json({ error: 'Unauthorized' });
    }
  }};


  module.exports = {isAuthenticated,redirectIfAuth,AuthAdmin}