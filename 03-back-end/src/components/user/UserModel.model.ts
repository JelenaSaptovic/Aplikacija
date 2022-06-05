import AdModel from '../ad/AdModel.model';
import IModel from '../../common/IModel.interface';

export default class UserModel implements IModel{
    userId: number;
    username: string;
    email : string;
    passwordHash?: string;
    forename: string;
    surname: string;
    isActive: boolean;  
    activationCode: string|null;

    ads?: AdModel[];
}

