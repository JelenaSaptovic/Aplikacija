import UserService, { DefaultUserAdapterOptions } from './UserService.service';
import { Request, Response } from "express";
import { AddUserValidator } from './dto/IAddUser.dto';
import IAddUser from './dto/IAddUser.dto';

class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async getAll(req: Request, res: Response) {
        this.userService.getAll(DefaultUserAdapterOptions)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
            
    }

    async getById(req: Request, res: Response) {
        const id: number = +req.params?.id;

        if (id === 4) {
            throw "Neki tekst!";
        }

        this.userService.getById(id, {
            loadAd: true
        })
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }
    async add(req: Request, res: Response){
        const data = req.body as IAddUser;

        if( !AddUserValidator(data)) {
            return res.status(400).send(AddUserValidator.errors);
        }

        this.userService.add(data)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(400).send(error?.message);
            });
    }
}

export default UserController;