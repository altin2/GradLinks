
const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/",async(req,res)=>{
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json("No token provided");
    
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) return res.status(401).json({ error: error.message });
      
      return res.json(user.email);
        
        
        
    } catch (err) {
        console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
    }
})






module.exports = router;
