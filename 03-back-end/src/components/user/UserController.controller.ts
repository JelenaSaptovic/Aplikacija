import { DefaultUserAdapterOptions } from './UserService.service';
import { Request, Response } from "express";
import { AddUserValidator } from './dto/IAddUser.dto';
import IAddUser from './dto/IAddUser.dto';
import { AddAdValidator, IAddAdDto } from '../ad/dto/IAddAd.dto';
import { EditUserValidator, IEditUserDto } from './dto/IEditUser.dto';
import { EditAdValidator, IEditAdDto } from '../ad/dto/IEditAd.dto';
import BaseController from '../../common/BaseController';

class UserController extends BaseController {
    
    async getAll(req: Request, res: Response) {
        this.services.user.getAll(DefaultUserAdapterOptions)
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

        this.services.user.getById(id, {
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

        this.services.user.add(data)
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(400).send(error?.message);
            });
    }

    async edit(req: Request, res: Response){
        const id: number = +req.params?.uid;

        const data = req.body as IEditUserDto;

        if(!EditUserValidator(data)){
            return res.status(400).send(AddUserValidator.errors);
        }

        this.services.user.getById(id, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }

                this.services.user.editById(
                    id, {
                        username: data.username
                    },
                    {
                        loadAd: true,
                    }
                )
                .then(result => {
                    res.send(result);
                })
                .catch(error => {
                    res.status(400).send(error?.message);
                })
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async addAd(req: Request, res: Response){
        const userId: number = +req.params?.uid;
        const data = req.body as IAddAdDto;

        if (!AddAdValidator(data)) {
            return res.status(400).send(AddAdValidator.errors);
        }

        this.services.user.getById(userId, {loadAd: true})
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }

                this.services.ad.add({
                    title: data.title,
                    user_id: userId
                })
                    .then(result => {
                        res.send(result);
                    })
                    .catch(error => {
                        res.status(400).send(error?.message);
                    });
            })    
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async editAd(req: Request, res: Response){
        const userId: number = +req.params?.uid;
        const adId: number = +req.params?.aid;

        const data: IEditAdDto = req.body as IEditAdDto;

        if (!EditAdValidator(data)){
            return res.status(400).send(EditAdValidator.errors);
        }

        this.services.user.getById(userId, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.status(404).send('User not found!');
                }

                this.services.ad.getById(adId, {})
                .then(result => {
                    if (result === null){
                        return res.status(404).send('Ad not found!');
                    }

                    if (result.userId !== userId) {
                        return res.status(400).send('This ad does not belong to this user.');
                    }

                    this.services.ad.editById(adId, data)
                    .then(result => {
                        res.send(result);
                    });
    
                });
            })
            .catch(error => {
                res.status(500).send(error.message);
        });
            
    }

    async deleteAd (req: Request, res: Response){
        const userId: number = +req.params?.uid;
        const adId: number = +req.params?.aid;

        this.services.user.getById(userId, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.status(404).send('User not found!');
                }

                this.services.ad.getById(adId, {})
                .then(result => {
                    if (result === null){
                        return res.status(404).send('Ad not found!');
                    }

                    if (result.userId !== userId) {
                        return res.status(400).send('This ad does not belong to this user.');
                    }

                    this.services.ad.deleteById(adId)
                    .then(result => {
                        res.send('This ad has been deleted!');
                    });
    
                });
            })
            .catch(error => {
                res.status(500).send(error.message);
        });
    }
}

export default UserController;