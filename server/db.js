const Pool = require("pg").Pool;

const pool = new Pool({
    user:"postgres",
    password:"RobFar200!",
    host:"localhost",
    port: 5432,
    database:"websitedb"
});
module.exports = pool;
