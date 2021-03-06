import * as mysql2 from "mysql2/promise";
import UserService from '../components/user/UserService.service';
import AdService from '../components/ad/AdService.service';
import PhotoService from "../components/photo/PhotoService.service";


export interface IServices {
    user: UserService;
    ad: AdService;
    photo: PhotoService;
}
export default interface IApplicationResources {
    databaseConnection: mysql2.Connection;
    services: IServices;
}