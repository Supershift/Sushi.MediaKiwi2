import fs from "fs";
import path from "path";
import { generateApi } from "swagger-typescript-api";

generateApi({
  name: "api.ts",
  output: path.resolve(process.cwd(), "./sample/services"),
  url: "",
  input: path.resolve(process.cwd(), "../Sushi.MediaKiwi.SampleAPI/swagger.sampleapi.json.tmp"),
  templates: path.resolve(process.cwd(), "./sample/services/generator/templates"),
  httpClientType: "axios",
  primitiveTypeConstructs: () => ({
    string: {
      "date-time": "Date",
    },
  }),
})
  .then(({ files }) => {
    files.forEach(({ fileContent, fileName }) => {
      fs.writeFile(fileName, fileContent, (err) => {
        if (err) console.log(err);
      });
    });
  })
  .catch((e) => console.error(e))

  // Remove tmp file
  .then(() =>
    fs.unlink(path.resolve(process.cwd(), "api"), (err) => {
      if (err) console.log(err);
    })
  );
