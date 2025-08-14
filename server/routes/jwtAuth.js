
const router = require("express").Router()
const pool = require('../db')
const bcrypt = require("bcrypt")
const jwtGenerator = require('../functions/jwtGenerator')
const validinfo = require("../middleware/validinfo")
const authorize = require("../middleware/authorization")
const supabase = require("../supabase-server.js")
//signup route
router.post("/signup",validinfo,async(req,res)=>{
    const{email,phonenumber,pass} = req.body;
    try {
        

        
        const{data:data,error:error}=await supabase
        .from("users")
        .select()
        .eq('email',email)
        

        if (error){
            res.status(500).send(error)
        }
        if (data.length > 0){
            return res.status(401).send("User already exists")
        }
        const Salt = await bcrypt.genSalt(10);
        const bcryptpassword = await bcrypt.hash(pass,Salt);
        const { data: insdata, error: error2 } = await supabase
  .from('users')
  .insert({ email, phonenumber, pass: bcryptpassword })
  .select();

        if (error2) {
        return res.status(500).send(error2);
        }
        if(insdata&&insdata.length>0){
            const jwtToken = jwtGenerator(insdata[0].userid);
            return res.json({ jwtToken });
        }
        

    } catch (err) {
        console.error(`in jwtAuth.js: ${err.message}`);
        res.status(500).send("Server Error")
    }
})

//login route

router.post("/login",validinfo, async(req,res) =>{
    try {
        const {email,pass} = req.body
        const{data:data,error:error}=await supabase
        .from("users")
        .select()
        .eq('email',email)
        if (data.length === 0) {
            return res.status(401).json("Invalid Credential");
        }
        const validpass = await bcrypt.compare(pass,data[0].pass)
        if (!validpass) {
            return res.status(401).json("Invalid Credential");
        }
        const jwtToken = jwtGenerator(data[0].userid)
        res.json({jwtToken})
    } catch (err) {
        console.error(`in jwtAuth.js: ${err.message}`);
        res.status(500).send("Server Error")
    }
})
router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(`in jwtAuth.js: ${err.message}`);
    res.status(500).send("Server error");
  }
});
module.exports = router;

