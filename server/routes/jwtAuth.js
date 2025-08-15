
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
        if (data.length>0){
            return res.status(401).send("User already exists")
        }

        //Add users to the table
        const { data: data2, error:error2 } = await supabase.auth.signUp({
            email: email,
            password: pass,
            options: {
              data: {
                
                phonenumber:phonenumber
              },
            },
          })

        if (error2) {
            console.log("In jwtAuth.js: ",error2)
        return res.status(500).send(error2);
        }
        console.log(data2.user.id)
        const jwtToken = jwtGenerator(data2.user.id);
        return res.json({ jwtToken });
    } catch (err) {
        console.error(`in jwtAuth.js: ${err.message}`);
        res.status(500).send("Server Error")
    }
})

//login route

router.post("/login",validinfo, async(req,res) =>{
    try {
        const {email,pass} = req.body
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
          })
        if (data.user===null) {
            return res.status(401).json("Invalid Credential");
        }
        const jwtToken = jwtGenerator(data.user.id)
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

