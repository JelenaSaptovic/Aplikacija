import IModel from '../../common/IModel.interface';
import PhotoModel from '../photo/PhotoModel.model';

class AdModel implements IModel{
    adId: number;
    title: string;
    description: string;
    expiresAt: string;
    price: number;
    flowerKind: string;
    color: string;
    country: string;
    lifeSpan: string;
    photos?: PhotoModel[] = [];
    userId: number; //FK
    
}

export default AdModel;