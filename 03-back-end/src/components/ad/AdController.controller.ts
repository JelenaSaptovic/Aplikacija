import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import { extname, basename, dirname } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from '../photo/PhotoModel.model';
import IConfig from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import { IResize } from '../../common/IConfig.interface';
import * as sharp from "sharp";
import { DefaultUserAdapterOptions } from "../user/UserService.service";


export default class AdController extends BaseController {
    
    async getAll(req: Request, res: Response) {
        this.services.ad.getAll({ loadPhotos: true})
            .then(result => {
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
            
    }

    async getSingleAd(req: Request, res: Response) {
        const adId: number = +req.params?.id;

        this.services.ad.getById(adId, {
            loadAd: true
        })
            .then(result => {
                if (result === null){
                    return res.sendStatus(404);
                }
                res.send(result);
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async getAdById(req: Request, res: Response){
        const userId: number = +req.params?.uid;
        const adId: number = +req.params?.aid;

        this.services.user.getById(userId, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.status(404).send('User not found!');
                }

                this.services.ad.getById(adId, { loadPhotos : true })
                .then(result => {
                    if (result === null){
                        return res.status(404).send('Ad not found!');
                    }

                    if (result.userId !== userId) {
                        return res.status(400).send('This ad does not belong to this user.');
                    }

                    res.send(result);
    
                })
                .catch(error => {
                    res.status(500).send(error?.message);
                });    
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
    }

    async uploadPhoto(req: Request, res: Response){
        const userId: number = +req.params?.uid;
        const adId: number = +req.params?.aid;

        //samo korisnik sa datim id može da dodaje slike u oglas koji je napravio
        if (req.authorisation?.userId !== userId){
            return res.status(403).send("You are not authorised to access this resource.!");
        }

        this.services.user.getById(userId, { loadAd: false })
            .then(result => {
                if (result === null){
                    return res.status(404).send('User not found!');
                }

                this.services.ad.getById(adId, {})
                .then(async result => {
                    if (result === null){
                        return res.status(404).send('Ad not found!');
                    }

                    if (result.userId !== userId) {
                        return res.status(400).send('This ad does not belong to this user.');
                    }

                    const uploadedFiles = this.doFileUpload(req, res);

                    if (uploadedFiles === null){
                        return;
                    }

                    const photos: PhotoModel[] = [];

                    for(let singleFile of await uploadedFiles){
                        const filename = basename(singleFile);

                        const photo = await this.services.photo.add({
                            name: filename,
                            file_path: singleFile,
                            ad_id: adId,
                        });

                        if (photo === null){
                            return res.status(500).send("Failed to add this photo into database!");
                        }

                        photos.push(photo);
                    }

                    res.send(photos);
                })
                .catch(error => {
                    if(!res.headersSent){
                        res.status(500).send(error?.message);
                    }    
                });    
            })
            .catch(error => {
                res.status(500).send(error?.message);
            });
            
    } 

    private async doFileUpload(req: Request, res: Response): Promise<string[] | null> {
        
        const config: IConfig = DevConfig;

        
        if (!req.files || Object.keys(req.files).length === 0){
            res.status(400).send("No file were uploaded!");
            return null;
        }    

        const fileFieldNames = Object.keys(req.files);

        const now = new Date();
        const year = now.getFullYear();
        const month = ((now.getMonth() + 1) + "").padStart(2, "0");

        const uploadDestinationRoot = config.server.static.path + "/";
        const destinationDirectory = config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";
        
        mkdirSync(uploadDestinationRoot + destinationDirectory, {
            recursive: true,
            mode: "755",
        });

        const uploadedFiles = [];

        for(let fileFieldName of fileFieldNames){
            const file = req.files[fileFieldName] as UploadedFile;

            const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

            if (!config.fileUploads.photos.allowedTypes.includes(type)){
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName} - type is not supported`);
                return null;

            }

            const declaredExtension = extname(file.name);

            if(!config.fileUploads.photos.allowedExtensions.includes(declaredExtension)){
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName} - extension is not supprted!`);
                return null;

            }

            const size = sizeOf(file.tempFilePath);

            if (size.width < config.fileUploads.photos.width.min || size.width > config.fileUploads.photos.width.max) {
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName} - image width is not supported!`);
                return null;

            }

            if (size.height < config.fileUploads.photos.height.min || size.height > config.fileUploads.photos.height.max) {
                unlinkSync(file.tempFilePath);
                res.status(415).send(`File ${fileFieldName} - image height is not supported!`);
                return null;

            }

            const fileNameRandomPart = uuid.v4();

            const fileDestinationPath = uploadDestinationRoot + destinationDirectory + fileNameRandomPart + "-" + file.name;

            file.mv(fileDestinationPath, async error => {
                if (error) {
                    res.status(500).send(`File ${fileFieldName} - could not be saved.`);
                    return null;
                }
                for (let resizeOptions of config.fileUploads.photos.resize){
                    await this.createResizedPhotos(destinationDirectory, fileNameRandomPart + "-" + file.name, resizeOptions );
                }

            });

            uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);

        }

        return uploadedFiles;
    
    }   

    private async createResizedPhotos(directory: string, filename: string, resizeOptions: IResize){
        const config: IConfig = DevConfig;

        await sharp(config.server.static.path + "/" + directory + filename)
            .resize({
                width: resizeOptions.width,
                height: resizeOptions.height,
                fit: resizeOptions.fit,
                background: resizeOptions.defaultBackground,
                withoutEnlargement: true,
            })
            .toFile(config.server.static.path + "/" + directory + resizeOptions.prefix + filename);

    }

    async deletePhoto(req: Request, res: Response){
        const userId: number = +(req.params?.uid);
        const adId: number = +(req.params?.aid);
        const photoId: number = +(req.params?.pid);

        //samo korisnik sa datim id može da dodaje obrise slike iz oglasa koji je napravio
        if (req.authorisation?.userId !== userId){
            return res.status(403).send("You are not authorised to access this resource.!");
        }

        this.services.user.getById(userId, DefaultUserAdapterOptions)
            .then(result => {
                if (result === null) throw { status: 404, message: "User not found!"};
                return result;
            })
            .then(async user => {
                return {
                    user: user,
                    ad: await this.services.ad.getById(adId, { loadPhotos: true}),

                };
            })
            .then ( ({ user, ad }) => {
                if (ad === null ) throw { status: 404, message: "Ad not found!" };
                if (ad.userId !== user.userId) throw { status: 404, message: "Ad not found for this user!" };
                return ad;
            })
            .then (ad => {
                const photo = ad.photos?.find(photo => photo.photoId === photoId);
                if (!photo) throw { status: 404, message: "Photo not found in this ad!" };
                return photo;
            })
            .then(async photo => {
                await this.services.photo.deleteById(photo.photoId);
                return photo;
            })
            .then (photo => {    
                const directoryPart = DevConfig.server.static.path + "/" + dirname(photo.filePath);
                const fileName = basename(photo.filePath);

                for(let resize of DevConfig.fileUploads.photos.resize){
                    const filePath = directoryPart + "/" + resize.prefix + fileName;
                    unlinkSync(filePath);
                }

                unlinkSync(DevConfig.server.static.path + "/" + photo.filePath);

                res.send("Photo deleted");
            })

            .catch(error => {
                res.status(error?.status ?? 500).send(error?.message ?? "Server side error!");
            })

    }
}   