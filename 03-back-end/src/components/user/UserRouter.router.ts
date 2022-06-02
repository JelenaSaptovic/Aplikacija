import UserController from "./UserController.controller";
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AdController from "../ad/AdController.controller";

class UserRouter  implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        
        const userController: UserController = new UserController(resources.services);
        const adController: AdController = new AdController(resources.services);



        application.get("/api/user", userController.getAll.bind(userController));
        application.get("/api/user/:id", userController.getById.bind(userController));
        application.post("/api/user", userController.add.bind(userController));
        application.put("/api/user/:uid", userController.edit.bind(userController));
        application.post("/api/user/:uid/ad", userController.addAd.bind(userController));
        application.put("/api/user/:uid/ad/:aid", userController.editAd.bind(userController));
        application.get("/api/user/:uid/ad/:aid", adController.getAdById.bind(adController));
        application.delete("/api/user/:uid/ad/:aid", userController.deleteAd.bind(userController));
        application.post("/api/user/:uid/ad/:aid/photo", adController.uploadPhoto.bind(adController));


    }
}

export default UserRouter;