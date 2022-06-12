import BaseController from '../../common/BaseController';
import { Request, Response } from "express";
import { IUserLoginDto } from './dto/IUserLogin.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import ITokenData from './dto/ITokenData';
import { DevConfig } from '../../configs';


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

        if(refreshTokenHeader === ""){
            return res.status(400).send("No token specified!");
        }

        const [ tokenType, token ] = refreshTokenHeader.trim().split(" ");

        if ( tokenType !== "Bearer" ){
            return res.status(401).send("Invalid token type!");
        }

        if(typeof token !== "string" || token.length === 0 ){
            return res.status(401).send("Token not specified");
        }

        try {
            const refreshTokenVerification = jwt.verify(token, DevConfig.auth.user.tokens.refresh.keys.public);

            if(!refreshTokenVerification){
                return res.status(401).send("Invalid token specified");
            }

            const originalTokenData = refreshTokenVerification as ITokenData;

            const tokenData: ITokenData = {
                userId: originalTokenData.userId,
                identity: originalTokenData.identity,
            }

            const authToken = jwt.sign(tokenData, DevConfig.auth.user.tokens.auth.keys.private, {
                algorithm: DevConfig.auth.user.algorithm,
                issuer: DevConfig.auth.user.issuer,
                expiresIn: DevConfig.auth.user.tokens.auth.duration,
            });

            res.send({
                authToken: authToken
            });
        } catch (error) {
            const message: string = (error?.message ?? "");

            if (message.includes("jwt expired")) {
                return res.status(401).send("Ths token has expired.");
            }

            res.status(500).send(error?.message);
        }    
    }
}