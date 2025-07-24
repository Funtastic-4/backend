import { Base } from "./base";
import type { User } from "./user";

class Volunteer extends Base {
  declare user_id: number;
}

interface IVolunteerRepository {
  GetVolunteerByUser(user: User): Volunteer;
}

export { Volunteer, type IVolunteerRepository };
