import UserModel from "./UserModel.model";
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import AdService from '../ad/AdService.service';
import IAddUser from './dto/IAddUser.dto';
import BaseService from '../../common/BaseService';
import IEditUser from './dto/IEditUser.dto';

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
        user.passwordHash = data?.password_hash;
        user.isActive = +data?.is_active === 1;


        if(options.loadAd){
            user.ads = await this.services.ad.getAllByUserId(user.userId, {});
        }

        return user;

    }

    public async add(data: IAddUser): Promise<UserModel> {
        return this.baseAdd(data, DefaultUserAdapterOptions);
    }

    public async editById(userId: number, data: IEditUser, options: IUserAdapterOptions = DefaultUserAdapterOptions): Promise<UserModel>{
        return this.baseEditById(userId, data, options);
    }
}

export default UserService;
export {DefaultUserAdapterOptions};