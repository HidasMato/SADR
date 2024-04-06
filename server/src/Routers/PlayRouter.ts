import Router from 'express';
import PlayController from '../Controllers/PlayController';

const PlayRouter = Router();

PlayRouter.get('/all', PlayController.getList);
PlayRouter.get('/:id', PlayController.getOneInfo);

PlayRouter.post('/new', PlayController.create);
PlayRouter.post('/:id/gamer', PlayController.plusUser);

PlayRouter.put('/:id/update', PlayController.update);

PlayRouter.delete('/:id/gamer', PlayController.minusUser);
PlayRouter.delete('/:id/delete', PlayController.delete);

export default PlayRouter; 