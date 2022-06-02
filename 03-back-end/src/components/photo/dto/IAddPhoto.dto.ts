import IServiceData from '../../../common/IServiceData.interface';


export default interface IAddPhoto extends IServiceData{
    name: string;
    file_path: string;
    ad_id: number;
}
