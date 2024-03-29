import Router from 'express';
import UserController from '../Controllers/UserController';

const UserRouter = Router();

UserRouter.post('/', UserController.create);
UserRouter.get('/:id', UserController.getUserInfoById);
UserRouter.put('/:id', UserController.change);
UserRouter.get('/', UserController.checkUserAuthByMail);

export default UserRouter; 