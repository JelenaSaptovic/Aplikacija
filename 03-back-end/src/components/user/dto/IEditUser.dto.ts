import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export default interface IEditUser extends IServiceData{
    password_hash: string;
    is_active?: number;
}

interface IEditUserDto{
    password: string;
    isActive?: boolean;
}


const EditUserSchema = {
    type: "object",
    properties: {
        password: {
            type: "string",
            pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
        },
        isActive: {
            type: "boolean",
        }

    },
    required: [
        "password",
    ],
    additionalProperties: false,
};

const EditUserValidator = ajv.compile(EditUserSchema);

export { EditUserValidator, IEditUserDto };