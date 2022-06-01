import AdModel from "./AdModel.model";
import BaseService from '../../common/BaseService';
import IAdapterOptions from '../../common/IAdapterOptions.interface';
import IAddAd from "./dto/IAddAd.dto";
import IEditAd from './dto/IEditAd.dto';

class AdAdapterOptions implements IAdapterOptions{

}

class AdService extends BaseService<AdModel, AdAdapterOptions>{
    
    tableName(): string {
        return "ad";
    }

    protected async adaptToModel(data: any): Promise<AdModel>{
        const ad: AdModel = new AdModel();

        ad.adId = +data?.ad_id;
        ad.title = data?.title;
        ad.description = data?.description;
        ad.description = data?.description;
        ad.expiresAt = data?.expires_at;
        ad.price = data?.price;
        ad.flowerKind = data?.flower_kind;
        ad.color = data?.color;
        ad.country = data?.country;
        ad.lifeSpan = data?.life_span;
        ad.userId = data?.user_id;

        return ad;
    }

    public async getAllByUserId(userId: number, options: AdAdapterOptions): Promise<AdModel[]> {
        return this.getAllByFieldNameAnValue('user_id', userId, options);
    }

    public async add(data: IAddAd): Promise<AdModel> {
        return this.baseAdd(data, {});
    }

    public async editById(adId: number, data: IEditAd): Promise<AdModel>{
        return this.baseEditById(adId, data, {});
    }

    public async deleteById(adId:number): Promise<true>{
        return this.baseDeleteById(adId);
    }
}

export default AdService;