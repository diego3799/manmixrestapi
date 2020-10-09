const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const GGBPool = require("./dist/GGBPool").GGBPool;
// const GGBPool = require("node-geogebra").GGBPool;
const fs = require("fs");
const poolOpts = {
  //   plotters: 5, //Number of plotters in the pool
  ggb: "local", //local or remote: From where to load Geogebra app
};

const andGeo = "∧";

const pool = new GGBPool(poolOpts);
app.use(cors());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const {
    body: { eqLines, eqArea },
  } = req;
  const areaPlotter = `a: x>=0 ${andGeo} y>=0 ` + eqArea.join(` ${andGeo} `);
  console.log(areaPlotter, eqLines);
  try {
    await pool.ready();
    const plotter = await pool.getGGBPlotter();
    const ggbScript = [...eqLines, areaPlotter];
    await plotter.evalGGBScript(ggbScript, 600, 400);
    const buffer = await plotter.export64("png");
    // fs.writeFileSync("dsds.png", svg64);
    await plotter.release();
    return res.status(200).send(buffer);
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => console.log("Listening on http://localhost:5000"));
