
const supabase = require("../supabase-server.js")
const router = require("express").Router()
const {createUserSupabase} = require("../middleware/createuser.js")

router.get("/",async(req,res)=>{
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json("No token provided");
      const { data: { user }} = await supabase.auth.getUser(token);
      const userSupabase = createUserSupabase(token);
      const userId = user.id
      const { data, error } = await userSupabase
      .from("users")
      .select("*")
      .eq('id',userId)
      if (error) return res.status(401).json({ error: error.message });
      
      return res.json(user.email);
        
        
        
    } catch (err) {
        console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
    }
})
//send notification by JWT
router.post("/sendnotification", async (req, res) => {
  try {
    const { message, recieverID } = req.body;
    console.log("Router hit with:", { message, recieverID });

    const token = req.headers.authorization?.split(" ")[1];
    const userSupabase = createUserSupabase(token);

    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await userSupabase
      .from("notifications")
      .insert([{ sender_id: user.id, message, user_id: recieverID }]);

    if (error) {
      console.error("Error sending notification:", error);
      return res.status(400).json({ error });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("In dashboard:", err.message);
    res.status(500).json({ error: err.message });
  }
});


//get notification by JWT
router.get("/recievenotification",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    const { data: { user }} = await supabase.auth.getUser(token);
    const userSupabase = createUserSupabase(token);
    const userId = user.id
    const { data, error } = await userSupabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    if (error) {
    console.error('Error fetching notifications:', error);
    } else {
      res.json(data)
    }
  } catch (err) {
    console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
  }
})
//get notification by its ID
router.post("/recievenotificationbyID",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) return res.status(401).json("No token provided");
    const userSupabase = createUserSupabase(token);
    const {notif_id} = req.body
    const { data, error } = await userSupabase
    .from('notifications')
    .select('*')
    .eq('notif_id', notif_id)
    if (error) {
    console.error('Error fetching notifications:', error);
    } else {
      res.json(data)
    }
  } catch (err) {
    console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
  }
})
router.post("/updatenotification",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) return res.status(401).json("No token provided");
    const userSupabase = createUserSupabase(token);
    const {notif_id} = req.body
    const {error} = await userSupabase
    .from('notifications')
    .update({is_read:true})
    .eq('notif_id',notif_id)
    if (error){
      console.error(`In dashboard: ${error.message}`)
        res.status(500).json(error)
    }
  } catch (err) {
    console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
  }
})




module.exports = router;
