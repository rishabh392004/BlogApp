const { validateToken } = require("../services/authentication");

function checkForAuthCookie(cookieName) {
  // 1. Added the arrow '=>' for the returned middleware function
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    // 2. If there is no cookie, we MUST return next() to stop further execution
    if (!tokenCookieValue) {
      return next();
    }

    try {
      // 3. Actually invoke validateToken and pass it the cookie value
      const userPayload = validateToken(tokenCookieValue);
      
      // 4. Attach the payload to the request object
      req.user = userPayload;
      
      // 5. Continue to the next middleware or route handler
      return next();
    } catch (error) {
      // 6. Call next() as a function if validation fails (e.g., token expired)
      return next();
    }
  };
}

module.exports = {
  checkForAuthCookie,
};