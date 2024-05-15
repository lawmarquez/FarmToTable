/*
  For Review:
  - transferred methods from server.js
*/

import {getReg, register, login} from './controller.js';

const router = (app) => {

  app.get('/register', getReg);
  app.post('/register', register);
  app.post('/login', login);

}

export default router;