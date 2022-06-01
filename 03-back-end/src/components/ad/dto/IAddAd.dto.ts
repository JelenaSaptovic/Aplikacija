import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();


export default interface IAddAd extends IServiceData{
    title: string;
    description: string;
    price: number;
    flower_kind: string;
    color: string;
    country: string;
    life_span: string;
    user_id: number;
}

export interface IAddAdDto{
    title: string;
    description: string;
    price: number;
    flowerKind: string;
    color: string;
    country: string;
    lifeSpan: string;
}

const AddAdSchema = ({
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
        "title",
        "description",
        "price",
        "flowerKind",
        "color",
        "country",
        "lifeSpan",
    ],
    additionalProperties: false,
});

const AddAdValidator = ajv.compile(AddAdSchema);

export { AddAdValidator };