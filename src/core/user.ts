import { Base } from "./Base";

class User extends Base {
  declare id: number;
  declare external_id: string;
  declare email: string;
  declare password?: string;
  declare phone_number: string;
  declare name: string;
  declare profile_image_url: string | undefined;
  declare verify_at: Date | null;

  isVerified(): boolean {
    return this.verify_at !== null;
  }
}

export { User };
