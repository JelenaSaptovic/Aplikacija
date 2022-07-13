import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';
import addFormats from "ajv-formats";


const ajv = new Ajv();
addFormats(ajv);


export default interface IEditUser extends IServiceData{
    password_hash?: string;
    forename?: string;
    surname?: string;
    is_active?: number;
    activation_code?: string;
}

interface IEditUserDto{
    password?: string;
    forename?: string;
    surname?: string;
    isActive?: boolean;
}


const EditUserSchema = {
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        email: {
            type: "string",
            format: "email",
        },
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        },
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        isActive: {
            type: "boolean",
        }

    },
    required: [
        
    ],
    additionalProperties: false,
};

const EditUserValidator = ajv.compile(EditUserSchema);

export { EditUserValidator, IEditUserDto };