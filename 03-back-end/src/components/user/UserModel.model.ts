import AdModel from '../ad/AdModel.model';
import IModel from '../../common/IModel.interface';
export default class UserModel implements IModel{
    userId: number;
    username: string;

    ads?: AdModel[];
}

