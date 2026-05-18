import "dotenv/config";
import { app } from "./src/app.js";
import { connectToDatabase } from "./src/config/database.js";

connectToDatabase();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
