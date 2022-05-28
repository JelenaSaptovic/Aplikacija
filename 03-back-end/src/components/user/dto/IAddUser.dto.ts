import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export default interface IAddUser extends IServiceData{
    username: string;
}


const AddUserSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        }

    },
    required: [
        "username",
    ],
    additionalProperties: false,
};

const AddUserValidator = ajv.compile(AddUserSchema);

export { AddUserValidator };