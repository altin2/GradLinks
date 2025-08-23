const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]; // extract Bearer token
    
    const { data: { user }} = await supabase.auth.getUser(token);

    const {data:data2,error:error2} = await supabase
    .from("users")
    .select('*')
    .eq('id',user.id)
    if (error2) {
        console.error(`In profile: ${error2.message}`)
      }
    return res.json(data2[0].isGrad);
        
        
        
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})


module.exports = router;
