const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lpsolve = require("lp_solve");
const dotenv = require("dotenv");
const Row = lpsolve.Row;
const lp = new lpsolve.LinearProgram();

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   return res.status(200).send("Im working");
// });

app.post("/", async (req, res) => {
  const {
    body: { objective, equations },
  } = req;
  console.log(objective);

  const lp = new lpsolve.LinearProgram();
  const x = lp.addColumn("x");
  const y = lp.addColumn("y");
  /**Setting the objective function */
  lp.setObjective(new Row().Add(x, objective.x).Add(y, objective.y));
  /**Passing all the constraints */
  equations.forEach((item, i) => {
    console.log(item);
    var constraint = new Row().Add(x, item.x).Add(y, item.y);
    lp.addConstraint(
      constraint,
      item.sign === ">=" ? "GE" : "LE",
      item.z,
      `eq${i}`
    );
  });

  lp.dumpProgram();
  lp.solve();
  const result = lp.getObjectiveValue();
  const resultX = lp.get(x);
  const resultY = lp.get(y);
  if (x !== null) {
    return res.status(200).send({
      result,
      resultX,
      resultY,
    });
  } else {
    return res.status(400).send({
      message: "No se encontró una solución optima",
    });
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
