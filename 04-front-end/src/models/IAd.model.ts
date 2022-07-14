import IPhoto from "./IPhoto.model";

export default interface IAd {
    adId: number;
    title: string;
    description: string;
    expiresAt: string;
    price: number;
    flowerKind: string;
    color: string;
    country: string;
    lifeSpan: string;
    photos: IPhoto[];
    userId: number; //FK
}