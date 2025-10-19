const express = require("express");
const router = express.Router();
const supabase = require("../supabase-server.js");
const {createUserSupabase} = require("../middleware/createuser.js")

function ParseExpression(input, expression) {
  expression = expression.trim();

  // Handle "number1 <> number2"
  const rangeMatch = expression.match(/^(\d+)\s*<>\s*(\d+)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return input > min && input < max;
  }

  // Handle "> number", "< number", ">= number", "<= number"
  const comparisonMatch = expression.match(/^(>=|>|<=|<)\s*(\d+)$/);
  if (comparisonMatch) {
    const operator = comparisonMatch[1];
    const number = parseFloat(comparisonMatch[2]);

    switch (operator) {
      case ">":  return input > number;
      case ">=": return input >= number;
      case "<":  return input < number;
      case "<=": return input <= number;
    }
  }

  console.error(`Invalid expression format: "${expression}"`);
}
function ReturnNumberofMatchingItems(arr1,arr2){
    const intersection = arr1.filter(element => arr2.includes(element));
    return intersection.length
}
const dictToArr = (dictionary) => {
    return Object.keys(dictionary).map(key => ({
        key: dictionary[key].record.id,
        record: dictionary[key].record,
        score: dictionary[key].score
        
    }));
};
//quick sort algorithm
function partition(arr, low, high)
{
    const pivot = arr[high].score;
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j].score < pivot) {
            i++;
            swap(arr, i, j);
        }
    }

    // move pivot after smaller elements and
    // return its position
    swap(arr, i + 1, high);
    return i + 1;
}
function swap(arr, i, j)
{
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
function SortByScore(arr, low, high)
{
    if (low < high) {
        let partindex = partition(arr, low, high);
        SortByScore(arr, low, partindex - 1);
        SortByScore(arr, partindex + 1, high);
    }
    return arr
}
function SortByRelevance(dict){
    const DictArr = dictToArr(dict)
    const newArr = SortByScore(DictArr,0,DictArr.length-1).reverse()
    return newArr
}

router.post("/uploadnotice", async (req, res) => {
  try {
    const {
      message,
      required_degree,
      required_skills,
      required_work,
      Title,
      date,
      verified
    } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    const userSupabase = createUserSupabase(token);

    const { data: noticeData, error: insertError } = await userSupabase
      .from("notices")
      .insert({
        message,
        required_degree: required_degree,
        required_skills: required_skills,
        required_work_years: required_work,
        Title,
        poster_id: user.id,
        expiry_date:date,
        Verified_Poster:verified
      })
      .select();

    if (insertError) {
  console.error("Supabase insert error:", insertError);
  return res.status(400).json({ error: insertError.message });
}

    res.json({ success:true,noticeID:noticeData[0].id });
  } catch (err) {
    console.error(`In notices: ${err.message}`);
    res.status(500).send({ error: err.message || "Internal server error" });
  }
});
router.post("/returnrelevantnotices",async(req,res)=>{
    
    try {
      const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const userSupabase = createUserSupabase(token);
        //For the body, it includes the user's degree_type, skills (array), and work_years
        const {WorkParam, SkillsParam, DegreeParam}=req.body
        const DegreeTypes=[
            "No formal education",
            "Primary education",
            "Secondary education",
            "GED",
            "Vocational qualification",
            "Bachelor's degree",
             "Master's degree",
             "Doctorate or higher"
        ]
        const Degree_Search = DegreeTypes.reverse().slice(DegreeTypes.indexOf(DegreeParam))
        //First returns notices based on degree_type and if they're after the expiry date.
        const { data, error } = await userSupabase
  .from("notices")
  .select("*")
  .in("required_degree", Degree_Search)
  .gt("expiry_date", new Date().toISOString()); // expiry_date < now

  

    var dictionary={}
    //Releavance algorithm:
    
    //Quick sort the array
    //Return the top 10 most relevant things.
    //Assigning matching values with an Rscore and their respective object
    for (let i=0; i<data.length;i++)
    {
        const userId = data[i].id; 
        dictionary[userId] = {
            record: data[i],  // the actual row from Supabase
            score: 0          // initial Rscore
        };
        //Value changes based on how many skills the user has matches the ones in the notice 
    //Given the user's work_years and a stringified expression, make the expression literal
    //  and compare it to the work_years
        dictionary[userId].score+= ReturnNumberofMatchingItems(data[i].required_skills,SkillsParam)
        dictionary[userId].score+= 4*ParseExpression(WorkParam,data[i].required_work_years)
    }
    const sorted = SortByRelevance(dictionary)
    const prioritylist = sorted.slice(0,10)
    const returnlist = prioritylist.map((entry)=> entry.record)


    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json(returnlist);
    

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})
router.post("/returnrandomnotices",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const userSupabase = createUserSupabase(token);
    const { data, error } = await userSupabase
  .from("random_notices")
  .select("*")
  .limit(10)
  .gt("expiry_date", new Date().toISOString()); 
  if (error){
    console.error(error)
    res.status(500).send(error)
  }
  res.json(data)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})
router.post("/returnpersonalnotices",async(req,res)=>{
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Missing token" });
    const userSupabase = createUserSupabase(token);
    const { data: { user } } = await supabase.auth.getUser(token);
    const { data, error } = await userSupabase
  .from("notices")
  .select()
  .eq('poster_id',user.id)
  .order('expiry_date',{ascending:false})
  
  if (error){
    console.error(error)
    res.status(500).send(error)
  }
  res.json(data)
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})


module.exports = router;
