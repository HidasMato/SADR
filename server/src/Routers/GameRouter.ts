import Router from 'express';
import GameController from '../Controllers/GameController';

const GameRouter = Router();

GameRouter.get('/', GameController.getList);
GameRouter.get('/:id', GameController.getOneInfo);
GameRouter.post('/', GameController.create);
GameRouter.put('/:id', GameController.update);
GameRouter.delete('/:id', GameController.delete);

export default GameRouter; 