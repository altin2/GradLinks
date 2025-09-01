const supabase = require("../supabase-server.js")
const router = require("express").Router()

router.get("/returnbioinfo",async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { data: { user }} = await supabase.auth.getUser(token);
        const { data, error } = await supabase.from("user_grad").select("bio_description,degree_type,work_years,skills_desc").eq("id", user.id);
        res.json(data[0]);

    } catch (err) {
        console.error(`In bio: ${err.message}`);
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})
router.get("/updatebioinfo",async(req,res)=>{
    try {
        const {bio_description,degree_type,work_years,skills_desc} = req.body
        const { data: { user }} = await supabase.auth.getUser(token);
    const {error} = await supabase
    .from("user_grad")
    .update({
        bio_description,
        degree_type,
        work_years,
        skills_desc
    })
    .eq("id",user.id)
    if(error){
        console.error(`In bio: ${err.message}`)
    res.status(500).send({ error: err.message || "Internal server error" });
    }
    } catch (err) {
        console.error(`In bio: ${err.message}`);
        res.status(500).send({ error: err.message || "Internal server error" });
    }
})

module.exports = router;