import BaseController from "../../common/BaseController";
import { Request, Response } from 'express';
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import { UploadedFile } from "express-fileupload";
import filetype from "magic-bytes.js";
import { extname, basename } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from '../photo/PhotoModel.model';
import IConfig from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";


export default class AdController extends BaseController {
    
    async getAll(req: Request, res: Response) {
        this.services.ad.getAll({})
            .then(result => {
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

                this.services.ad.getById(adId, {})
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

                    for(let singleFile of uploadedFiles){
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

    private doFileUpload(req: Request, res: Response): string[]|null {
        
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

            file.mv(fileDestinationPath, error => {
                if (error) {
                    res.status(500).send(`File ${fileFieldName} - could not be saved.`);
                    return null;
                }

            });

            uploadedFiles.push(destinationDirectory + fileNameRandomPart + "-" + file.name);

        }

        return uploadedFiles;
    
    }   
}   