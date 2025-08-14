
const supabase = require("../supabase-server.js")
const router = require("express").Router()
const authorization = require("../middleware/authorization")

router.get("/",authorization,async(req,res)=>{
    try {

        const{data,error}=await supabase
        .from("users")
        .select()
        .eq('userid',req.user.id)
        
        if (error){
            res.status(500).send("Server Error")
        }
        if(data){
            res.json(data)
        }
        
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Server Error")
    }
})






module.exports = router;
