import Router from "express";
import PlayController from "../Controllers/PlayController";

const PlayRouter = Router();

PlayRouter.get("/all", PlayController.getList);
PlayRouter.get("/creatorinfo", PlayController.getCreatorInfo);
PlayRouter.get("/:id", PlayController.getOneInfo);
PlayRouter.get("/playsgame/:id", PlayController.getPlaysGame);

PlayRouter.post("/new", PlayController.createPlay);
PlayRouter.post("/:id/gamer", PlayController.plusGamer);

PlayRouter.put("/:id/change", PlayController.changePlay);

PlayRouter.delete("/:id/gamer", PlayController.minusGamer);
PlayRouter.delete("/:id/delete", PlayController.delete);

export default PlayRouter;
