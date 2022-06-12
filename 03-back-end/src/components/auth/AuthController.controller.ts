import BaseController from '../../common/BaseController';
import { Request, Response } from "express";
import { IUserLoginDto } from './dto/IUserLogin.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import ITokenData from './dto/ITokenData';
import { DevConfig } from '../../configs';
import AuthMiddleware from '../../middlewares/AuthMiddleware';


export default class AuthController extends BaseController{
    public async userLogin(req: Request, res: Response){
        const data = req.body as IUserLoginDto;

        this.services.user.getByEmail(data.email)
        .then(result => {
            if (result === null){
                throw {
                    status: 404,
                    message: "User account not found"
                };
            }

            return result;
        })
        .then(user => {
            if (!bcrypt.compareSync(data.password, user.passwordHash)){
                throw {
                    status: 404,
                    message: "User account not found"
                };
            }

            return user;
        })
        .then(user => {
            const tokenData: ITokenData = {
                userId: user.userId,
                identity: user.forename + " " + user.surname,
            };

            const authToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.auth.duration,
            });

            const refreshToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.refresh.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.refresh.duration,
            });
        
            res.send({
                authToken: authToken,
                refreshToken: refreshToken,
            });

        })    
        .catch(error => {
            setTimeout(() => {
                res.status(error?.status ?? 500).send(error?.message);
            }, 1500);    
        });
    }

    userRefresh(req: Request, res: Response){
        const refreshTokenHeader: string = req.headers?.authorization ?? "";

        try {
            const tokenData = AuthMiddleware.validateTokenAs(refreshTokenHeader, "refresh");

            const authToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.auth.duration,
            });

            res.send({
                authToken: authToken
            });
        } catch (error) {
            res.status(error?.status ?? 500).send(error?.message);

        }    
    }
}