
const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]; // extract Bearer token
    if (!token) {
      return res.status(401).json("No token provided");
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    //Token is out of time
    if (error) {
      console.error(`In dashboard: ${error.message}`)
      return res.json("session over");
    }

    if (!user) {
      return res.json("session over");
    }

    return res.json(user.email);
        
        
        
    } catch (err) {
        console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
    }
})






module.exports = router;
