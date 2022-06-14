import { NextFunction } from "express";
import { Request, Response } from "express";
import ITokenData from '../components/auth/dto/ITokenData';
import * as jwt from "jsonwebtoken";
import { DevConfig } from "../configs";


export default class AuthMiddleware {
    public static getVerifier(... allowed: ("user")[]): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction) => {
            this.verifyAuthToken(req, res, next, allowed);
        }
    }

    private static verifyAuthToken(req: Request, res: Response, next: NextFunction, allowed: ("user")[]){
        const tokenHeader: string = req.headers?.authorization ?? "";
    
        try {
            const checks = [];

            const check = this.validateTokenAs(tokenHeader, "auth");

            if(check){
                checks.push(check);
            }

            if (checks.length === 0) {
                throw{
                    status: 403,
                    message: "You are not authorised to access this resource.",
                }
            }

            req.authorisation = checks [0];

            next();
        } catch (error){
            res.status(error?.status ?? 500).send(error?.message);   
        }
    }

    public static validateTokenAs(tokenString: string, type: "auth" | "refresh"): ITokenData{
        if(tokenString === ""){
            throw {
                status: 400,
                message: "No token specified!",
            };
        }    

        const [ tokenType, token ] = tokenString.trim().split(" ");

        if ( tokenType !== "Bearer" ){
            throw {
                status: 401,
                message: "Invalid token type!",
            };
        }

        if(typeof token !== "string" || token.length === 0 ){
            throw {
                status: 401,
                message: "Token not specified!",
            };
        }

        try {
            const tokenVerification = jwt.verify(token, DevConfig.auth.user.tokens.refresh.keys.public);

            if(!tokenVerification){
                throw {
                    status: 401,
                    message: "Invalid token secified!",
                };            
            }

            const originalTokenData = tokenVerification as ITokenData;

            const tokenData: ITokenData = {
                userId: originalTokenData.userId,
                identity: originalTokenData.identity,
            };

            return tokenData;

        } catch (error) {
            const message: string = (error?.message ?? "");

            if (message.includes("jwt expired")) {
                throw {
                    status: 401,
                    message: "This token has expired!",
                };
            }

            throw {
                status: 500,
                message: error?.message,
            };       
        }    
    }
}