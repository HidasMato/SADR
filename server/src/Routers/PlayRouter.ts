import Router from 'express';
import PlayController from '../Controllers/PlayController';

const PlayRouter = Router();

PlayRouter.get('/all', PlayController.getList);
PlayRouter.get('/:id', PlayController.getOneInfo);

PlayRouter.post('/new', PlayController.create);
PlayRouter.post('/:id/gamer', PlayController.plusGamer);

PlayRouter.put('/:id/update', PlayController.update);

PlayRouter.delete('/:id/gamer', PlayController.minusGamer);
PlayRouter.delete('/:id/delete', PlayController.delete);

export default PlayRouter; 