import db from "../config/db.js";

const describeTable = async (tableName) => {
    try {
        const [rows] = await db.promise().query(`DESCRIBE ${tableName}`);
        console.log(`---SCHEMA_${tableName}---`);
        console.log(JSON.stringify(rows, null, 2));
        console.log("---END---");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

describeTable("applications");
