const {Router}=require('express')
const  router=Router()
const User=require("../models/user")
router.get("/signin",(req,res)=>{
return res.render("signin")
})

router.get("/signup",(req,res)=>{
    return res.render("signup")
})


router.post("/signin",async (req,res)=>{
const {email,password} = req.body;
//hamare paass jo pass hai wo hash 
try{
    const token = await User.matchPasswordandGenrateToken(email, password);

return res.cookie("token", token).redirect("/");
}catch(error){
    return res.render("signin", { error: "Incorrect Email or Password" });
}
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})

router.post("/signup", async (req,res)=>{
const {fullName,email,password} = req.body
await User.create({
    fullName,
    email,
    password,
})
try{
    return res.cookie("token", token).redirect("/");
}catch(error){
    return res.render("signup",{error: "Duplicate email address is not allowed"})
}
})


module.exports=router