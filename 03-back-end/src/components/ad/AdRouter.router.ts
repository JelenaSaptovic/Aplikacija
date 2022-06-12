import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from "../../common/IRouter.interface";
import AdController from './AdController.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

class AdRouter  implements IRouter{
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        
        const adController: AdController = new AdController(resources.services);

        application.get("/api/ad", AuthMiddleware.getVerifier("user"), adController.getAll.bind(adController));
    }
}

export default AdRouter;