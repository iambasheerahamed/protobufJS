const express = require("express");
const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/", (req, res, next) => {
  next();
});

app.use("/get", (req, res) => {
  res.json({ response: "SUCCESS" });
});

app.use(express.static("static"));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
