import * as express from "express";
import * as cors from "cors";
import IConfig from "./config/IConfig.interface";
import { DevConfig } from "./config/configs";
import UserController from './components/user/UserController.controller';
import UserService from './components/user/UserService.service';
import * as fs from "fs";
import * as morgan from "morgan";

const config: IConfig = DevConfig;

fs.mkdirSync("./logs", {
    mode: 0o755,
    recursive: true,
});

const application: express.Application = express();

application.use(morgan(":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms", {
    stream: fs.createWriteStream("./logs/access.log")
}));

application.use(cors());
application.use(express.json());

application.use(config.server.static.route, express.static(config.server.static.path, {
    index: config.server.static.index,
    dotfiles: config.server.static.dotfiles,
    cacheControl: config.server.static.cacheControl,
    etag: config.server.static.etag,
    maxAge: config.server.static.maxAge
}));

const userService: UserService = new UserService();

const userController: UserController = new UserController(userService);

application.get("/api/user", userController.getAll.bind(userController));
application.get("/api/user/:id", userController.getById.bind(userController));



application.use((req, res) => {
    res.sendStatus(404);
});

application.listen(config.server.port);

