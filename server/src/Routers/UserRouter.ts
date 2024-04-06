import Router from 'express';
import UserController from '../Controllers/UserController';

const UserRouter = Router();

UserRouter.get('/activate/:link',UserController.activateLink)
UserRouter.get('/refresh', UserController.refresh)
UserRouter.get('/all', UserController.getList)
UserRouter.get('/:id', UserController.getUserInfoById);

UserRouter.put('/:id/update', UserController.change);

UserRouter.post('/registration', UserController.registration)
UserRouter.post('/login',UserController.login) 
UserRouter.post('/logout', UserController.logout)

export default UserRouter; 