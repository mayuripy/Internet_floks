import path from 'path';
import dotenv from 'dotenv';
const rootDir = path.resolve(__dirname, "../test");
const pth = path.join(rootDir, '.env.test');
dotenv.config({ path:  pth});

import { PORT } from '../config';
import { sequelize } from '../db';
import { app } from '../providers';
import { Community, Member, Role, User } from '../models';


export const initTestServer = async () => {
  try {
    const port = Number(PORT);
    sequelize.addModels([User, Role, Community, Member]);

    await sequelize.sync({ alter: true });

    await sequelize.authenticate();
    console.log('Connected to the test database');

    const server = app.listen(port, () => {
      console.log(`Express test server is listening on port ${port}`);
    });

    return { app, server } ;
  } catch (error) {
    console.error('Unable to connect to the test database:', error);
    throw error; // Throw error to indicate initialization failure
  }
};
