import fs from "node:fs";

const buffer = fs.readFileSync("./add.wasm");

WebAssembly.instantiate(buffer).then((result) => {
  console.log(result.instance.exports);
  const { b } = result.instance.exports;

  console.log(b(5, 6));
});
