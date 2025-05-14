import path from "path";
import dotenv from "dotenv";

// Resolve the root directory
// Load environment variables from .env.local file
const rootDir = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(rootDir, ".env.local") });

import { PORT } from "./config";
import { sequelize } from "./db";
import { app } from "./providers";
import { Community, Member, Role, User } from "./models";

/**
 * Initializes the Express server with Sequelize database connection.
 * Logs connection status and starts the server on specified port.
 */
const initExpress = async () => {
  try {
    const port = Number(PORT);

    sequelize.addModels([User, Role, Community, Member]);

    // await sequelize.sync({ force: true }); // Uncomment to clear and re-initialize tables
    await sequelize.sync({ alter: true }); // Syncs models with database without clearing existing data

    await sequelize.authenticate();
    console.log("Connected to DB");

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error: any) {
    console.log(error);
  }
};

// Initialize Express server
initExpress();
