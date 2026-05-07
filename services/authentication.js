const JWT =require('jsonwebtoken');
const secret ="rishabh@1234T"
function CreateTokenForUser(user){
    const payload ={
        id: user.id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role : user.role,
    }
    return JWT.sign(payload, secret);
    return token
}
function validateToken(token){
    const payload=JWT.verify(token,secret)
    return payload;
}
module.exports={
    CreateTokenForUser,
    validateToken
}