import IModel from '../../common/IModel.interface';

class AdModel implements IModel{
    adId: number;
    title: string;
    userId: number; //FK
    
}

export default AdModel;