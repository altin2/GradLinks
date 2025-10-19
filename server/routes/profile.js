const supabase = require("../supabase-server.js")
const router = require("express").Router()
const {createUserSupabase} = require("../middleware/createuser.js")
router.get("/returngradstatus",async(req,res)=>{
    try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    // Create user-scoped client for RLS
    const userSupabase = createUserSupabase(token);

    const { data, error } = await userSupabase
      .from("users")
      .select("*")
      .eq("id", user.id)  
      .single();

    if (error) {
      console.error(`Supabase error: ${error.message}`);
      return res.status(404).json({ error: "User row not found" });
    }

    return res.json({ isgrad: data.isgrad });

  } catch (err) {
    console.error(`Server error: ${err.message}`);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
})
//GET router from graduate info
router.get("/returngradinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const userSupabase = createUserSupabase(token);
    
        const { data: { user }} = await supabase.auth.getUser(token);
        const {data,error} = await userSupabase
        .from("user_grad")
        .select("*")
        .eq("id",user.id)
        if(error){
            console.error(`In profile "/returngradinfo": ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
        }
        res.json(data[0])
    } catch (err) {
        console.error(`In profile "/returngradinfo": ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
//UPDATE operation for user_grad
router.post("/updategradinfo",async(req,res)=>{
    try {

        const {first_name,last_name,middle_name,age} = req.body
    const token = req.headers.authorization?.split(" ")[1]; 
    const userSupabase = createUserSupabase(token);
    const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await userSupabase
    .from("user_grad")
    .update({
        first_name,
        last_name,
        middle_name,
        age
    })
    .eq("id",user.id)
    if(error){
        console.error(`In profile "/updategradinfo": ${err.message}`)
    res.status(500).send({ error: err.message || "Internal server error" });
    }
    res.json("Success")
    } catch (err) {
        console.error(`In profile "/updategradinfo": ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
    
})
router.post("/returnuserinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]; 
    const userSupabase = createUserSupabase(token);
       const {id:uid} = req.body
    const {data,error} = await userSupabase
    .from("users")
    .select()
    .eq("id",uid)
    
    if (error) return error
    if (!data[0].isgrad){
        const {data:data2,error:error2} = await userSupabase
        .from("user_employer")
        .select()
        .eq("id",uid)
        if (error2) return error2
        res.json(data.concat(data2))
    }
    else{
        const {data:data2,error:error2} = await userSupabase
        .from("user_grad")
        .select()
        .eq("id",uid)
        if (error2) return error2
        res.json(data.concat(data2))
    } 
    } catch (err) {
        console.error(`In profile "/returnuserinfo": ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
    
})
//GET router from employer info
router.get("/returnempinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
    const userSupabase = createUserSupabase(token);
        const { data: { user }} = await supabase.auth.getUser(token);
        const {data,error} = await userSupabase
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

        const {company_name,bio,isVerified} = req.body
    const token = req.headers.authorization?.split(" ")[1]; 
    const userSupabase = createUserSupabase(token);
    const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await userSupabase
    .from("user_employer")
    .update({
        company_name,
        bio,
        isVerified
    })
    .eq("id",user.id)
    if(error){
        console.error(`In profile "/updateempinfo": ${err.message}`)
    res.status(500).send({ error: err.message || "Internal server error" });
    }
    res.json("Success")
    } catch (err) {
        console.error(`In profile "/updateempinfo": ${err.message}`)
        res.status(500).send({ error: err.message || "Internal server error" });
    }
    
})

module.exports = router;
