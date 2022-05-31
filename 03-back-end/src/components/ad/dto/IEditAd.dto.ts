import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export interface IEditAdDto{
    title: string;
}

export default interface IEditAd extends IServiceData{
    title: string;
}

const EditAdSchema = ({
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

const EditAdValidator = ajv.compile(EditAdSchema);

export { EditAdValidator };