import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export interface IAddAdDto{
    title: string;
}

export default interface IAddAd extends IServiceData{
    title: string;
    user_id: number;
}

const AddAdSchema = ({
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 4,
            maxLength: 128,
        },

    },
    required: [
        "titile",
    ],
    additionalProperties: false,
});

const AddAdValidator = ajv.compile(AddAdSchema);

export { AddAdValidator };