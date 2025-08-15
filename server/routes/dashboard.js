
const supabase = require("../supabase-server.js")
const router = require("express").Router()
const authorization = require("../middleware/authorization")

router.get("/",authorization,async(req,res)=>{
    try {

        const{data,error}=await supabase
        .from("users")
        .select()
        .eq('id',req.user.id)
       if (error){
            res.status(500).send(error)
        }
        if(data){
            res.json(data)
        } 
        
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json(err)
    }
})






module.exports = router;
