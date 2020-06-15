module.exports = function (req, res, next) {
    if (req.session.isAuthenticatedAdmin || req.session.isAuthenticated) {
      console.log('authAdmin');
      return res.redirect("/");
    }
    next();
  };