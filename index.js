const app = require("./app")
const port = process.env.PORT || 5500;

app.listen(port, () => {
  try {
    console.log(`server running at port:http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
