const supabase = require("../supabase-server.js");
const router = require("express").Router();
const {createUserSupabase} = require("../middleware/createuser.js")

function ReturnNumberofMatchingItems(arr1,arr2){
    const intersection = arr1.filter(element => arr2.includes(element));
    return intersection.length
}
function ReturnWorkYearScore(expression,param1,param2,input){
    if (expression==="<>"){
        return Number(param1 < input && input < param2);
        }else if (expression===">"){
       return Number(input>param1)
        }else if (expression===">="){
     return Number(input>=param1)       
        }else if (expression==="<"){
            return  Number(input<param1)
        }else if (expression==="<="){
           return Number(input<=param1)
        }
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


router.post("/", async (req, res) => {
    try {
      const { WorkParam, SkillParam, DegreeParam, UniParam } = req.body;
  
      const { data, error } = await supabase
        .from("user_grad")
        .select("*")
        .in("degree_type", DegreeParam);
  
      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }
  
      var dictionary = {};
      const WorkExpressions = WorkParam.split(" ");
  
      for (let i = 0; i < data.length; i++) {
        const userId = data[i].id;
        dictionary[userId] = { record: data[i], score: 0 };
  
        dictionary[userId].score += ReturnNumberofMatchingItems(data[i].skills_desc, SkillParam);
        dictionary[userId].score += 3 * ReturnNumberofMatchingItems([data[i].attended_uni], UniParam);
  
        let param2 = WorkExpressions.length > 2 ? parseInt(WorkExpressions[2]) : undefined;
        dictionary[userId].score += ReturnWorkYearScore(
          WorkExpressions[0],
          parseInt(WorkExpressions[1]),
          param2,
          data[i].work_years
        );
      }
  
      const sorted = SortByRelevance(dictionary);
      const prioritylist = sorted.slice(0, 10);
      const returnlist = prioritylist.map((entry) => entry.record);
      return res.json(returnlist); 
      
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });
  

router.get("/returnunis",async(req,res)=>{
    try {
    const token = req.headers.authorization?.split(" ")[1]; 
    const userSupabase = createUserSupabase(token);
        const {data,error} = await userSupabase 
    .from("universities")
    .select()
    if (error){
        res.status(500).send(error)
    }
    res.json(data)
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    
})

module.exports = router         