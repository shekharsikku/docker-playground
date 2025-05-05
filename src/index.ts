import app from "./app.js";
import env from "./utils/env.js";

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
