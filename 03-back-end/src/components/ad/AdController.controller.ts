import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';

export default class AdController extends BaseController {
    
    async getAll(req: Request, res: Response) {
        this.services.ad.getAll({})
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
            
    }
}   