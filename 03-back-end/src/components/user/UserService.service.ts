import UserModel from "./UserModel.model";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import BaseService from '../../common/BaseService';
import IEditUser from './dto/IEditUser.dto';
import { IAddUser } from "./dto/IRegisterUser.dto";

interface IUserAdapterOptions extends IAdapterOptions{
    loadAd: boolean;
    removeActivationCode: boolean;
}

const DefaultUserAdapterOptions: IUserAdapterOptions = {
    loadAd: false,
    removeActivationCode: false,
}
class UserService extends BaseService<UserModel, IUserAdapterOptions>{
    tableName(): string {
        return "user";
    }

    protected async adaptToModel(data: any, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel>{
        const user: UserModel = new UserModel();

        user.userId = +data?.user_id;
        user.username = data?.username;
        user.email = data?.email;
        user.passwordHash = data?.password_hash;
        user.forename = data?.forename;
        user.surname = data?.surname;
        user.isActive = +data?.is_active === 1;
        user.activationCode = data?.activation_code ? data?.activation_code : null;


        if(options.loadAd){
            user.ads = await this.services.ad.getAllByUserId(user.userId, { loadPhotos: false });
        }

        if(options.removeActivationCode){
            user.activationCode = null;
        }

        return user;

    }

    public async add(data: IAddUser): Promise<UserModel> {
        return this.baseAdd(data, { removeActivationCode: false, loadAd: false, });
    }

    public async editById(userId: number, data: IEditUser, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel>{
        return this.baseEditById(userId, data, options);
    }

    public async getUserByActivationCode(code: string, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel|null>{
        return new Promise((resolve, reject) => {
            this.getAllByFieldNameAnValue("activation_code", code, options)
                .then(result => {
                    if (result.length === 0) {
                        return resolve(null);
                    }

                resolve(result[0]);

                })
                .catch(error => {
                    reject(error?.message);
                });
                
        });
    }

    public async getByEmail(email: string, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel|null>{
        return new Promise((resolve, reject) => {
            this.getAllByFieldNameAnValue("email", email, options)
                .then(result => {
                    if (result.length === 0) {
                        return resolve(null);
                    }

                resolve(result[0]);

                })
                .catch(error => {
                    reject(error?.message);
                });
                
        });
    }
}

export default UserService;
export {DefaultUserAdapterOptions};