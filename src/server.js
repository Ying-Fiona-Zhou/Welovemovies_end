const { PORT = 5001 } = process.env;
const app = require("./app");

const listener = () => {
  console.log(`Server is listening on port ${PORT}`);
};

app.listen(PORT, "0.0.0.0", listener);
