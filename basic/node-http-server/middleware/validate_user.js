const jwt = require('jsonwebtoken');

const validateUser = (req, res, next) => {
  try{
    //lets grab the access token
const token = req.headers.authorization.replace("Bearer ", "")
   // proceed to decode
   const decodedData = jwt.verify(token, process.env.JWTSECRET);
   console.log("from middle ware", decodedData);
   req.userData = decodedData;
   next();
  } catch(err){
    return res.status(401).json({
        message:"Authentication failed",
    });
  }
}

module.exports = validateUser;