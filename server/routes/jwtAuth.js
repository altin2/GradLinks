
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
     const { data: data2, error:error2 } = await supabase.auth.signUp({ email: email, password: pass, }) 
     if (error2) { 
      console.error("In jwtAuth.js: ",error2) 
      return res.status(500).send(error2); 
    } //Add users to corresponding graduate or employer table
     if (isGrad){ 
      const {error:error3} = await supabase .
      from("user_grad") 
      .insert({id:data2.user.id }) 
      if (error3) { 
        console.error("In jwtAuth.js: ",error3) 
        return res.status(500).send(error3); } 
      } else{ 
        const {error:error4} = await supabase 
        .from("user_employer") 
        .insert({id:data2.user.id }) 


        if (error4) { 
          console.error("In jwtAuth.js: ",error4) 
          return res.status(500).send(error4); } } 
         
            res.json([data2]) 
          } catch (err) {
            console.error(`in jwtAuth.js: ${err.message}`); 
            res.status(500).send("Server Error") 
          } 
        })

//login route

router.post("/login",validinfo, async(req,res) =>{
    try {
        
        
        const {email,pass} = req.body

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: pass,
          })
        if (data.user===null) {
            return res.status(401).json("Invalid Credential");
        }
        res.json([data.session.access_token,data.session.refresh_token])
        
        
    } catch (err) {
        console.error(`in jwtAuth.js: ${err.message}`);
        res.status(500).send("Server Error")
    }
})


//verify JWT 
router.post("/verify", async(req,res)=>{
  try {
    const token = req.headers.jwt_token;
    if (typeof token === "string" && token.trim() !== "" && token !== "undefined" && token !== "null") {
      res.json(true);
    } else {
      res.json(false);
    }

    
    
  } catch (err) {
    console.error(`in jwtAuth.js: ${err.message}`);
    res.status(500).send(err)
    
  }
})


module.exports = router;

