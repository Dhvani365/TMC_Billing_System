import con from "./utils/connectDB.js";
import xlsx from "xlsx";
import fs from 'fs';

con.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Read Excel file
    const filePath = "./static/RT & RB NEW STOCK SHEET-SIDDHANT.xlsx"; // Change to your file path
    if (!fs.existsSync(filePath)) {
        console.error("Excel file not found at specified path.");
        return;
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(sheetData)
    // if (sheetData.length === 0) {
    //     console.log("No data found in the Excel sheet.");
    //     return;
    // }

    // // Insert data into Catalogs table
    // const sql = "INSERT INTO Catalogs (catalog_name) VALUES ?";
    // const values = sheetData.map(row => [row.catalog_name]);

    // con.query(sql, [values], (err, result) => {
    //     if (err) throw err;
    //     console.log(`${result.affectedRows} rows inserted into Catalogs table.`);
    // });
});