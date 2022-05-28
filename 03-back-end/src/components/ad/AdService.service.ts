import AdModel from "./AdModel.model";
import * as mysql2 from 'mysql2/promise';
import BaseService from '../../common/BaseService';
import IAdapterOptions from '../../common/IAdapterOptions.interface';

class AdAdapterOptions implements IAdapterOptions{

}

class AdService extends BaseService<AdModel, AdAdapterOptions>{
    
    tableName(): string {
        return "ad";
    }

    protected async adaptToModel(data: any): Promise<AdModel>{
        const ad: AdModel = new AdModel();

        ad.adId = +data?.ad_id;
        ad.userId = data?.user_id;

        return ad;
    }

    public async getAllByUserId(userId: number, options: AdAdapterOptions): Promise<AdModel[]> {
        return this.getAllByFieldNameAnValue('user_id', userId, options);
    }

}

export default AdService;