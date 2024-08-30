import express from 'express';
const app = express();
const port = process.env.PORT || 8000;
import path from 'node:path';
const __dirname =  path.join(process.cwd(), "..");
app.use(express.static(__dirname + "/anura_env/public/"));
app.use(express.static(__dirname + "/anura_env/build/"));
app.use("/apps", express.static(__dirname + "/anura_env/apps/"));

app.listen(port, () => console.log("Listening on port: ", port))
