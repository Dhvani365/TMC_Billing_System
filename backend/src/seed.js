import con from "./utils/connectDB.js";
import xlsx from "xlsx";
import fs from 'fs';

const items = {
    "KONDITORI": 1,
    "KAJARAKH": 2,
    "KNOORIE": 3,
    "KANTHKALA - TOPAZ": 4,
    "KSHASHA SILK": 5,
    "KAAKSHI SILK": 6,
    "KANTHKALA - LUXE": 7,
    "KNOORIE - SEASONS": 8,
    "KAZULE": 9,
    "KANTHKALA -PICHWAI": 10,
    "KARSHINI SILK": 11,
    "KANMANI SILK": 12,
    "KANVI SILK - ROYALS": 13,
    "KAIZAA SILK": 14,
    "KAROL SILK": 15,
    "KANVI SILK - SENSES": 16,
    "KIROZAA SILK": 17,
    "KYAARI TISSUE": 18,
    "KLAURA SILK": 19,
    "KAMSAARA SILK": 20,
    "KIAAN SILK": 21,
    "KZAINAAB": 22,
    "KAALA SAVOY": 23,
    "KAPRI LINEN": 24,
    "KERNIA'S": 25,
    "KALAMARI": 26,
    "KALOMA": 27,
    "KOSHA SILK": 28,
    "KOOKAL SILK": 29,
    "KAALA RUBY": 30,
    "KONTESSA SILK": 31,
};

con.connect(async (err) => {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Read Excel file
    const filePath = "./static/RT & RB NEW STOCK SHEET-SIDDHANT.xlsx"; // Change to your file path
    if (!fs.existsSync(filePath)) {
        console.error("Excel file not found at specified path.");
        return;
    }

    const workbook = xlsx.readFile(filePath); // Change filename if needed
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    const cleanedData = [];
    let currentCatalog = '';

data.forEach((row) => {
  if (row['GIRNAR FASHION'] && row.__EMPTY && !(row.__EMPTY_1 === 'SKU')) {
    // If row contains catalog name, update currentCatalog
    currentCatalog = row['GIRNAR FASHION'];
    cleanedData.push({
    catalog_id: items[currentCatalog.trim()],
      catalog_name: currentCatalog.trim(),
      sku: row.__EMPTY_1,
    });
  } else if (row.__EMPTY_1 && !(row.__EMPTY_1 === 'SKU')) {
    // If only SKU and stock status are present (child rows)
    cleanedData.push({
    catalog_id: items[currentCatalog.trim()],
      catalog_name: currentCatalog.trim(),
      sku: row.__EMPTY_1,
    });
  }
});
console.log(cleanedData)
for (const row of cleanedData) {
    const { catalog_id, sku } = row;
    if (!catalog_id) continue;

    try {
      // Get product_id from products table
      const [productResults] = await queryAsync(
        `SELECT product_id FROM products WHERE product_name = ?`,
        [sku]
      );

      if (productResults.length > 0) {
        const product_id = productResults[0].product_id;

        // Insert into catalog_products
        await queryAsync(
          `INSERT INTO catalog_products (catalog_id, product_id) VALUES (?, ?)`,
          [catalog_id, product_id]
        );

        console.log(`Inserted: Catalog ID ${catalog_id}, Product ID ${product_id}`);
      } else {
        console.warn(`Product not found for SKU: ${sku}`);
      }
    } catch (error) {
      console.error(`Error processing SKU ${sku}:`, error);
    }
  }

  console.log("Processing complete.");
  con.end();
});

// Helper function for async/await MySQL queries
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    con.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve([results]);
    });
  });
};