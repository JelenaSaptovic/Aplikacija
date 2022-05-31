import UserController from "./UserController.controller";
import UserService from "./UserService.service";
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AdService from '../ad/AdService.service';

class UserRouter  implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const userService: UserService = new UserService(resources.databaseConnection);
        const adService: AdService = new AdService(resources.databaseConnection);

        const userController: UserController = new UserController(userService, adService);

        application.get("/api/user", userController.getAll.bind(userController));
        application.get("/api/user/:id", userController.getById.bind(userController));
        application.post("/api/user", userController.add.bind(userController));
        application.put("/api/user/:uid", userController.edit.bind(userController));
        application.post("/api/user/:uid/ad", userController.addAd.bind(userController));
        application.put("/api/user/:uid/ad/:aid", userController.editAd.bind(userController));
        application.delete("/api/user/:uid/ad/:aid", userController.deleteAd.bind(userController));


    }
}

export default UserRouter;