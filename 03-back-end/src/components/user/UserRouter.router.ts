import UserController from "./UserController.controller";
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AdController from "../ad/AdController.controller";
import AuthMiddleware from "../../middlewares/AuthMiddleware";

class UserRouter  implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        
        const userController: UserController = new UserController(resources.services);
        const adController: AdController = new AdController(resources.services);



        application.get("/api/user", AuthMiddleware.getVerifier("user"), userController.getAll.bind(userController));
        application.get("/api/user/:id", AuthMiddleware.getVerifier("user"), userController.getById.bind(userController));
        application.post("/api/user/register", userController.register.bind(userController));
        application.get("/api/user/activate/:code", userController.activate.bind(userController));
        application.put("/api/user/:uid", AuthMiddleware.getVerifier("user"), userController.edit.bind(userController));
        application.post("/api/user/:uid/ad", AuthMiddleware.getVerifier("user"), userController.addAd.bind(userController));
        application.put("/api/user/:uid/ad/:aid", AuthMiddleware.getVerifier("user"), userController.editAd.bind(userController));
        application.get("/api/user/:uid/ad/:aid", adController.getAdById.bind(adController));
        application.delete("/api/user/:uid/ad/:aid", AuthMiddleware.getVerifier("user"), userController.deleteAd.bind(userController));
        application.post("/api/user/:uid/ad/:aid/photo", AuthMiddleware.getVerifier("user"), adController.uploadPhoto.bind(adController));
        application.delete("/api/user/:uid/ad/:aid/photo/:pid", AuthMiddleware.getVerifier("user"), adController.deletePhoto.bind(adController));

    }
}

export default UserRouter;