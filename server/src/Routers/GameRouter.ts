import Router from "express";
import GameController from "../Controllers/GameController";

const GameRouter = Router();
GameRouter.get("/all", GameController.getList);
GameRouter.get("/:id", GameController.getOneInfo);
GameRouter.post("/new", GameController.create);
GameRouter.put("/:id/update", GameController.update);
GameRouter.delete("/:id/delete", GameController.delete);
GameRouter.get("/:id/comments", GameController.getComments);
GameRouter.post("/:id/comments", GameController.addComment);

export default GameRouter;
