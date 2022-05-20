import UserModel from "./UserModel.model";

class UserService {
    public async getAll(): Promise<UserModel[]> {
        const users: UserModel[] = [];

        users.push({
            userId: 1,
            username: "Jelena"
        });

        users.push({
            userId: 2,
            username: "Filip"
        });

        users.push({
            userId: 7,
            username: "Damljan"
        });

        return users;
    }

    public async getById(userId: number): Promise<UserModel|null> {
        if (userId == 4) {
            return null;
        }
        
        
        return {
            userId: userId,
            username: "Username " + userId + "."
        }
    }
}

export default UserService;