import UserModel from "./UserModel.model";
import * as mysql2 from 'mysql2/promise';
import { resolve } from 'path';
import { rejects } from "assert";

class UserService {
    private db: mysql2.Connection;

    constructor(databaseConnection: mysql2.Connection){
        this.db = databaseConnection;
    }

    private async adaptToModel(data: any): Promise<UserModel>{
        const user: UserModel = new UserModel();

        user.userId = +data?.user_id;
        user.username = data?.username;

        return user;
    }

    public async getAll(): Promise<UserModel[]> {
        return new Promise<UserModel[]>(
            (resovle, reject) => {
                const sql: string = "SELECT * FROM `user` ORDER BY `username`;";
                this.db.execute(sql)
                    .then( async ([ rows ]) => {
                        if (rows === undefined){
                            return resovle([]);
                        }

                        const users: UserModel[] = [];

                        for (const row of rows as mysql2.RowDataPacket[]) {
                            users.push(await this.adaptToModel(row)); 
                        }

                        resovle(users);
                    })
                    .catch(error => {
                        reject(error);
                    });

            }
        );
    }

    public async getById(userId: number): Promise<UserModel|null> {
        return new Promise<UserModel> (
            (resolve, reject) => {
                const sql: string = "SELECT * FROM `user` WHERE user_id = ?;";

                this.db.execute(sql, [ userId ])
                    .then(async ([ rows ]) => {
                        if (rows === undefined){
                            return resolve(null);
                    }

                        if(Array.isArray(rows) && rows.length === 0){
                            return resolve(null);
                        }
                    
                        resolve(await this.adaptToModel(rows[0]));
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        );
    }
}

export default UserService;