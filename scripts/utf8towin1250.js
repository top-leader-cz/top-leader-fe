const fs = require("fs");
const iconv = require("iconv-lite");

const inputFilePath = __dirname + "/input8.csv";
const outputFilePath = __dirname + "/input1250-converted.csv";

const inputBuffer = fs.readFileSync(inputFilePath);
const inputData = iconv.decode(inputBuffer, "utf8");

const outputData = iconv.encode(inputData, "win1250");

fs.writeFileSync(outputFilePath, outputData);

console.log("CSV file converted successfully!");
