
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
//send notification by JWT
router.get("/sendnotification",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { data: { user }} = await supabase.auth.getUser(token);
    const userId = user.id
      const {message}=req.body
      const { data, error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, message: message }]);
      if (error) {
      console.error('Error sending notification:', error);
      } else {
      console.log('Notification sent:', data);
      }
  } catch (err) {
    console.error(`In dashboard: ${err.message}`)
        res.status(500).json(err)
  }
})
//get notification by JWT
router.get("/recievenotification",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    const { data: { user }} = await supabase.auth.getUser(token);
    const userId = user.id
    const { data, error } = await supabase
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
    const {notif_id} = req.body
    const { data, error } = await supabase
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
    const {notif_id} = req.body
    const {error} = await supabase
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
