import { DefaultUserAdapterOptions } from './UserService.service';
import { Request, Response } from "express";
import { AddAdValidator, IAddAdDto } from '../ad/dto/IAddAd.dto';
import IEditUser, { EditUserValidator, IEditUserDto } from './dto/IEditUser.dto';
import { EditAdValidator, IEditAdDto } from '../ad/dto/IEditAd.dto';
import BaseController from '../../common/BaseController';
import * as bcrypt from "bcrypt";
import { IRegisterUserDto, RegisterUserValidator } from './dto/IRegisterUser.dto';
import * as uuid from "uuid";
import UserModel from './UserModel.model';

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

    async register(req: Request, res: Response){
        const body = req.body as IRegisterUserDto;

        if( !RegisterUserValidator(body)) {
            return res.status(400).send(RegisterUserValidator.errors);
        }

        const passwordHash = bcrypt.hashSync(body.password, 10);

        this.services.user.add({
            username: body.username,
            email: body.email,
            password_hash: passwordHash,
            forename: body.forename,
            surname: body.surname,
            activation_code: uuid.v4(),
        })
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(400).send(error?.message);
            });
    }

    activate(req: Request, res: Response){
        const code: string = req.params?.code;

        this.services.user.getUserByActivationCode(code, {
            removeActivationCode: true,
            loadAd: false,
        })
        .then(result => {
            if (result === null) {
                throw {
                    status: 404,
                    message: "User not found!",
                }
            }

            return result;
        })
        .then(result => {
            const user = result as UserModel;

            return this.services.user.editById(user.userId, {
                is_active: 1,
                activation_code: null,
            });
        })
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            setTimeout(() =>{
                res.status(error?.status ?? 500).send(error?.message);
            }, 500);    
        });
    }

    async edit(req: Request, res: Response){
        const id: number = +req.params?.uid;

        const data = req.body as IEditUserDto;

        if(!EditUserValidator(data)){
            return res.status(400).send(EditUserValidator.errors);
        }

        this.services.user.getById(id, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }

                const serviceData: IEditUser = { };

                if (data.isActive !== undefined){
                    serviceData.is_active = data.isActive ? 1 : 0;
                }

                if (data.forename !== undefined){
                    serviceData.forename = data.forename;
                }

                if (data.surname !== undefined){
                    serviceData.surname = data.surname;
                }

                if (data.password !== undefined){
                    const passwordHash = bcrypt.hashSync(data.password, 10);
                    serviceData.password_hash = passwordHash;
                }

                this.services.user.editById(
                    id, serviceData,
                    {
                        loadAd: true,
                        removeActivationCode: true,
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

        this.services.user.getById(userId, {loadAd: true, loadPhoto: false})
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }

                this.services.ad.add({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    flower_kind: data.flowerKind,
                    color: data.color,
                    country: data.country,
                    life_span: data.lifeSpan,
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

        this.services.user.getById(userId, { loadAd: false})
            .then(result => {
                if (result === null){
                    return res.status(404).send('User not found!');
                }


                this.services.ad.getById(adId, { loadPhotos: false})
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