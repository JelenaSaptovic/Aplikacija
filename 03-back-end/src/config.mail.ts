import { IMailConfiguartion } from './common/IConfig.interface';

const MailConfigurationParameters: IMailConfiguartion = {
    host: "smtp.office365.com",
    port: 587,
    email: "",
    password: "",
    debug: true,
}

export { MailConfigurationParameters };