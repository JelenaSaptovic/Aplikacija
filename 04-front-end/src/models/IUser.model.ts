import IAd from "./IAd.model";

export default interface IUser {
    userId: number;
    username: string;
    email : string;
    passwordHash: string;
    forename: string;
    surname: string;
    isActive: boolean;  
    activationCode: string|null;
    ads?: IAd[]; 
}