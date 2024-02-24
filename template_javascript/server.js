const express = require("express");

const app = express();

app.use("/__mnt", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/anura_env"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
