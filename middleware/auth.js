module.exports = function (req, res, next) {
  if (!req.session.isAuthenticated && !req.session.isAuthenticatedAdmin) {
    console.log('auth1')
    return res.redirect("/");
  }
  next();
};
