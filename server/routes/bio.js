const supabase = require("../supabase-server.js")
const router = require("express").Router()
const {createUserSupabase} = require("../middleware/createuser.js")

router.get("/returnbioinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { data: { user }} = await supabase.auth.getUser(token);
        const { data, error } = await supabase.from("user_grad").select("bio_description,degree_type,work_years,skills_desc,attended_uni").eq("id", user.id);
        res.json(data[0]);
    } catch (err) {
        console.error(`In bio: ${err.message}`);
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
router.post("/updatebioinfo",async(req,res)=>{
    try {
        const {bio_description,degree_type,work_years,skills_desc,attended_uni} = req.body
        const token = req.headers.authorization?.split(" ")[1];
        const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await supabase
    .from("user_grad")
    .update({
        bio_description,
        degree_type,
        work_years,
        skills_desc,
        attended_uni
    })
    .eq("id",user.id)
    if(error){
        console.error(`In bio: ${err.message}`)
        res.json({ error: err.message || "Internal server error" });
    }else{
        res.json("Successfully updated Bio")
    }
    
    } catch (err) {
        console.error(`In bio: ${err.message}`);
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})

module.exports = router;