import Router from "express";
import UserController from "../Controllers/UserController";
import PlayController from "../Controllers/PlayController";

const UserRouter = Router();

UserRouter.get("/activate/:link", UserController.activateLink);
UserRouter.get("/newlink", UserController.newLink);
UserRouter.get("/refresh", UserController.refresh);
UserRouter.get("/masters", UserController.getAllMasters);
UserRouter.get("/all", UserController.getList);
UserRouter.get("/info", UserController.getUserInfo);
UserRouter.get("/playsgamer", PlayController.getPlaysGamer);
UserRouter.get("/playsmaster", PlayController.getPlaysMaster);
UserRouter.get("/getrule", UserController.getRules);
UserRouter.get("/allrules", UserController.getAllRules);
UserRouter.get("/:id", UserController.getUserInfoById);

UserRouter.put("/update", UserController.change);

UserRouter.post("/registration", UserController.registration);
UserRouter.post("/sendmail", UserController.sendMail);
UserRouter.post("/login", UserController.login);
UserRouter.post("/logout", UserController.logout);

export default UserRouter;
