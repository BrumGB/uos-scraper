import fs from 'fs';

export default function (jsonContent) {
  fs.writeFile("output.json", JSON.stringify(jsonContent), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  fs.appendFileSync('output.json', JSON.stringify(jsonContent));
}
