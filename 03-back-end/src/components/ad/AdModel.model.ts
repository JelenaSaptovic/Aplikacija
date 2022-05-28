import IModel from '../../common/IModel.interface';

class AdModel implements IModel{
    adId: number;
    userId: number; //FK
    
}

export default AdModel;