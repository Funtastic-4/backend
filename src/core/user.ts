import { Base } from "./base";

class User extends Base {
  declare id: number;
  declare external_id: string;
  declare email: string;
  declare phone_number: string;
  declare name: string;
  declare profile_image_url: string | undefined;
}

interface IUserService {}

interface IUserRepository {
  getById(id: number): Promise<User>;
}

export { User, type IUserService, type IUserRepository };
