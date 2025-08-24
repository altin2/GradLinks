
const router = require("express").Router()
const validinfo = require("../middleware/validinfo")
const supabase = require("../supabase-server.js")
//signup route
router.post("/signup",validinfo,async(req,res)=>{ 
  const{email,phonenumber,pass,isGrad} = req.body; 
  try { const{data:data,error:error}=await supabase 
  .from("users") 
  .select() 
  .eq('email',email) 
  if (error){ 
    res.status(500).send(error) } 
    if (data.length>0){ return res.status(401).json("Email already in use") }
     //Add users to the table 
     const { data: data2, error:error2 } = await supabase.auth.signUp({ 
      email: email, 
      password: pass,
      options: {
        data: {
          custom_phone: phonenumber,
          isGrad,
        }
      }
     }
    ) 
     if (error2) { 
      console.error("In jwtAuth.js: ",error2) 
      return res.status(500).send(error2); 
    }
    const user = data2.user;

    if (!user) {
      return res.status(400).json("Signup failed: no user returned");
    }
    const uid = user.id
    
    //Add users to corresponding graduate or employer table
     if (isGrad){ 
      const {error:error3} = await supabase .
      from("user_grad") 
      .insert({id:uid}) 
      if (error3) { 
        console.error("In jwtAuth.js: ",error3) 
        return res.status(500).send(error3); } 
      } else{ 
        const {error:error4} = await supabase 
        .from("user_employer") 
        .insert({id:uid}) 


        if (error4) { 
          console.error("In jwtAuth.js: ",error4) 
          return res.status(500).send(error4); } } 
         
            res.json([data2]) 
          } catch (err) {
            console.error(`in jwtAuth.js: ${err.message}`); 
            res.status(500).send("Server Error") 
          } 
        })




//verify JWT 
router.post("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json(false);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return res.json(false);
    res.json(true); 
  } catch (err) {
    console.error(`in jwtAuth.js: ${err.message}`);
    res.json(false);
  }
});

module.exports = router;

