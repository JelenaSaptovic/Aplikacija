import UserModel from "./UserModel.model";
import * as mysql2 from 'mysql2/promise';
import { resolve } from 'path';
import { rejects } from "assert";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import AdService from '../ad/AdService.service';
import IAddUser from './dto/IAddUser.dto';
import { ResultSetHeader } from "mysql2/promise";
import BaseService from '../../common/BaseService';

interface IUserAdapterOptions extends IAdapterOptions{
    loadAd: boolean;
}

const DefaultUserAdapterOptions: IUserAdapterOptions = {
    loadAd: false,
}
class UserService extends BaseService<UserModel, IUserAdapterOptions>{
    tableName(): string {
        return "user";
    }

    protected async adaptToModel(data: any, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel>{
        const user: UserModel = new UserModel();

        user.userId = +data?.user_id;
        user.username = data?.username;

        if(options.loadAd){
            const adService: AdService = new AdService(this.db);

            user.ads = await adService.getAllByUserId(user.userId, {});
        }

        return user;
    }

    public async add(data: IAddUser): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            const sql: string = "INSERT `user` SET `username` = ?;";
            this.db.execute(sql, [ data.username ])
                .then(async result => {
                    const info: any = result;

                    const newUserId = +(info[0]?.insertId);

                    const newUser: UserModel|null = await this.getById(newUserId, DefaultUserAdapterOptions);

                    if(newUser === null) {
                        return reject({message: 'Duplicate user name', });
                    }

                    resolve(newUser);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

export default UserService;
export {DefaultUserAdapterOptions};