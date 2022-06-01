import IModel from '../../common/IModel.interface';

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
    userId: number; //FK
    
}

export default AdModel;