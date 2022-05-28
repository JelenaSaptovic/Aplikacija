import UserController from "./UserController.controller";
import UserService from "./UserService.service";
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";

class UserRouter  implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const userService: UserService = new UserService(resources.databaseConnection);

        const userController: UserController = new UserController(userService);

        application.get("/api/user", userController.getAll.bind(userController));
        application.get("/api/user/:id", userController.getById.bind(userController));
        application.post("/api/user", userController.add.bind(userController));
    }
}

export default UserRouter;