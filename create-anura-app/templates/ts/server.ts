import express from 'express';
const app = express();
const port = process.env.PORT || 8000;
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import wisp from 'wisp-server-node';
import { Socket } from 'node:net';

app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/anura_env/public/")));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/anura_env/build/")));
app.use("/__mnt", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "dist/src/")));
app.use("/apps", express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "/anura_env/apps/")));

const server = app.listen(port, () => console.log("Listening on port: ", port))
server.on("upgrade", (request: any, socket: any, head: any) => {
    wisp.routeRequest(request, socket as Socket, head);
});
