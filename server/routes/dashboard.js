
const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/",async(req,res)=>{
    try {
        const { data: { user } ,error} = await supabase.auth.getUser(req.headers.jwt_token)
       if (error){
            res.status(500).send(error)
        }
        if(user){
            res.json(user.email)
        } 
        
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json(err)
    }
})






module.exports = router;
