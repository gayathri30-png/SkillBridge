import db from "../config/db.js";

const checkAll = async () => {
    try {
        console.log("---USERS---");
        const [u] = await db.promise().query("DESCRIBE users");
        console.log(u.map(r => r.Field).join(", "));
        
        console.log("---JOBS---");
        const [j] = await db.promise().query("DESCRIBE jobs");
        console.log(j.map(r => r.Field).join(", "));
        
        console.log("---APPS---");
        const [a] = await db.promise().query("DESCRIBE applications");
        console.log(a.map(r => r.Field).join(", "));
        
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
};
checkAll();
