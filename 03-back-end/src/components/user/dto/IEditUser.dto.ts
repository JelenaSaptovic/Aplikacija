import Ajv from "ajv";
import IServiceData from '../../../common/IServiceData.interface';

const ajv = new Ajv();

export default interface IEditUser extends IServiceData{
    username: string;
}

interface IEditUserDto{
    username: string;
}


const EditUserSchema = {
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

const EditUserValidator = ajv.compile(EditUserSchema);

export { EditUserValidator, IEditUserDto };