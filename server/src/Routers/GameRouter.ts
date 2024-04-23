import Router from "express";
import GameController from "../Controllers/GameController";

const GameRouter = Router();
GameRouter.get("/all", GameController.getList);
GameRouter.get("/:id", GameController.getOneInfo);
GameRouter.post("/new", GameController.create);
GameRouter.put("/:id/update", GameController.update);
GameRouter.delete("/:id/delete", GameController.delete);

export default GameRouter;
