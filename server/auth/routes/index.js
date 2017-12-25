const IoC = require('AppIoC');
const { Router } = require('express');

const routes = (socialRoutes, userRepository, superUser) => {
  const authRouter = Router();

  authRouter.use(socialRoutes);

  authRouter.get('/users', async (req, res, next) => {
    const users = await userRepository.query(superUser, {});
    res.send(users);
  });

  return authRouter;
};

IoC.callable('auth.routes', [
  'auth.socialRoutes',
  'auth.userRepository',
  'auth.superUser',
], routes);
