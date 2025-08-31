const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/returngradstatus",async(req,res)=>{
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
    return res.json(data2[0].isgrad);
        
        
        
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
//GET router from graduate info
router.get("/returngradinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
    
        const { data: { user }} = await supabase.auth.getUser(token);
        const {data,error} = await supabase
        .from("user_grad")
        .select("*")
        .eq("id",user.id)
        if(error){
            console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
        }
        res.json(data[0])
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
//UPDATE operation for user_grad
router.post("/updategradinfo",async(req,res)=>{
    try {

        const {first_name,last_name,middle_name,age} = req.body
    const token = req.headers.authorization?.split(" ")[1]; 
    const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await supabase
    .from("user_grad")
    .update({
        first_name,
        last_name,
        middle_name,
        age
    })
    .eq("id",user.id)
    if(error){
        console.error(`In profile: ${err.message}`)
    res.status(500).send({ error: err.message || "Internal server error" });
    }
    res.json("Success")
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
    
})

//GET router from employer info
router.get("/returnempinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
    
        const { data: { user }} = await supabase.auth.getUser(token);
        const {data,error} = await supabase
        .from("user_employer")
        .select("*")
        .eq("id",user.id)
        if(error){
            console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
        }
        res.json(data[0])
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
//UPDATE operation for user_employer
router.post("/updateempinfo",async(req,res)=>{
    try {

        const {company_name,bio} = req.body
    const token = req.headers.authorization?.split(" ")[1]; 
    const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await supabase
    .from("user_employer")
    .update({
        company_name,
        bio
    })
    .eq("id",user.id)
    if(error){
        console.error(`In profile: ${err.message}`)
    res.status(500).send({ error: err.message || "Internal server error" });
    }
    res.json("Success")
    } catch (err) {
        console.error(`In profile: ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
    
})

module.exports = router;
