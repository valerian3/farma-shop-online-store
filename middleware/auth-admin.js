module.exports = function (req, res, next) {
    if (!req.session.isAuthenticatedAdmin) {
      console.log('authAdmin');
      return res.redirect("/");
    }
    next();
  };