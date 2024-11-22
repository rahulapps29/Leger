const fs = require("fs");

// Specify the JSON file path
const inputFilePath = "product.json";
const outputFilePath = "output.json";

// List of properties to delete
const propertiesToDelete = ["__v", "completed", "year", "_id"];

// Function to delete specified properties from JSON data
function deletePropertiesFromJson(filePath, propertiesToDelete) {
  try {
    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Assuming the data is an array
    if (Array.isArray(jsonData)) {
      const updatedData = jsonData.map((item) => {
        propertiesToDelete.forEach((property) => {
          delete item[property];
        });
        return item;
      });

      // Write the updated data back to a new file
      fs.writeFileSync(
        outputFilePath,
        JSON.stringify(updatedData, null, 2),
        "utf8"
      );
      console.log("Updated JSON file saved to:", outputFilePath);
    } else {
      console.error("JSON data is not an array.");
    }
  } catch (error) {
    console.error("Error processing JSON file:", error.message);
  }
}

// Call the function
deletePropertiesFromJson(inputFilePath, propertiesToDelete);
