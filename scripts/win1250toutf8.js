const fs = require("fs");
const iconv = require("iconv-lite");

const inputFilePath = __dirname + "/input1250.csv";
const outputFilePath = __dirname + "/input.csv";

const inputBuffer = fs.readFileSync(inputFilePath);
const inputData = iconv.decode(inputBuffer, "win1250");

const outputData = iconv.encode(inputData, "utf8");

fs.writeFileSync(outputFilePath, outputData);

console.log("CSV file converted successfully!");
