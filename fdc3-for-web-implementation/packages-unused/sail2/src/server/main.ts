import express from "express";
import ViteExpress from "vite-express";
import { initDesktopAgentService } from "./da/DesktopAgentService";

const app = express();

// // eventually, directory needs to be connected to session
// const directory = new FDC3_2_1_JSONDirectory()
// ///directory.load("temp/appd.json")
// directory.load('https://directory.fdc3.finos.org/v2/apps/')
// //directory.load('https://directory.fdc3.finos.org/v2/apps/')

app.get("/iframe", (_, res) => {
  res.send("Hello Vite + TypeScript!");
});

// app.get("/apps", (_, res) => {
//   res.send(JSON.stringify(directory.allApps))
// })


const httpServer = ViteExpress.listen(app, 8090, () =>
  console.log("Server is listening on port 8090..."),
);


initDesktopAgentService(httpServer)
