import express from "express";

const path = process.argv[2];

const app = express();
const port = 3000;

app.use(express.static(path));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
