import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export default interface IAddUser extends IServiceData{
    username: string;
    password_hash: string;
}

export interface IAddUserDto{
    username: string;
    password: string;
}


const AddUserSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 4,
            maxLength: 32,
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        }

    },
    required: [
        "username",
        "password",
    ],
    additionalProperties: false,
};

const AddUserValidator = ajv.compile(AddUserSchema);

export { AddUserValidator };