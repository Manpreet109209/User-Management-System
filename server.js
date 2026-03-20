const app = require("./src/app");

const PORT = process.env.PORT || 2211;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});