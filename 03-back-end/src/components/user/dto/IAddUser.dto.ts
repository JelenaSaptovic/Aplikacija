import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddUser{
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