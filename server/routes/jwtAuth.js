
const router = require("express").Router()
const pool = require('../db')
const bcrypt = require("bcrypt")
const jwtGenerator = require('../functions/jwtGenerator')
const validinfo = require("../middleware/validinfo")
const authorize = require("../middleware/authorization")
//signup route
router.post("/signup",validinfo,async(req,res)=>{
    const{email,phonenumber,pass} = req.body;
    try {
        

        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email])
        if (user.rows.length > 0){
            return res.status(401).json("User already exists")
        }
        const Salt = await bcrypt.genSalt(10);
        const bcryptpassword = await bcrypt.hash(pass,Salt);
        const newuser =  await pool.query("INSERT INTO users(email,phonenumber,pass) VALUES($1,$2,$3) RETURNING *",[email,phonenumber,bcryptpassword]);
        const jwtToken = jwtGenerator(newuser.rows[0].userid);
        return res.json({ jwtToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

//login route

router.post("/login",validinfo, async(req,res) =>{
    try {
        const {email,pass} = req.body
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }
        const validpass = await bcrypt.compare(pass,user.rows[0].pass)
        if (!validpass) {
            return res.status(401).json("Invalid Credential");
        }
        const jwtToken = jwtGenerator(user.rows[0].userid)
        res.json({jwtToken})
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})
router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;

