import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export interface IEditAdDto{
    title?: string;
    description?: string;
    price?: number;
    color?: string;
    country?: string; 
}

export default interface IEditAd extends IServiceData{
    title?: string;
    description?: string;
    price?: number;
    color?: string;
    country?: string;
}

const EditAdSchema = ({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 128,
        },
        description: {
            type: "string",
            maxLength: 500,
        },
        price: {
            type: "number",
            multipleOf: 0.01,
            minimum: 0.01,
        },
        flowerKind: {
            type: "string",
            maxLength: 64,
        },
        color: {
            type: "string",
            minLength: 3,
            maxLength: 64,
        },
        country: {
            type: "string",
            maxLength: 128,
        },
        lifeSpan: {
            type: "string",
            maxLength: 128,
        },
    },
    required: [
        
    ],
    additionalProperties: false,
});

const EditAdValidator = ajv.compile(EditAdSchema);

export { EditAdValidator };