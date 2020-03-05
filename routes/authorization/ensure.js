const jwt = require("jsonwebtoken");

function ensureAuthorized(req, res, next) {
    const token = req.headers["access-token"];
    if (token) {
        jwt.verify(token, "El Classroom de Moviles.", (err, decoded) => {      
          if (err) {
            return res.status(403).json({status : 'unauthorized'});    
          } else {
            req.decoded = decoded;  
            // console.log(decoded);  
            next();
          }
        });
  
    } else {
        return res.status(403).json({status : 'unauthorized'});
    }
}

exports.authorized=ensureAuthorized;