export class Event {
  declare id: number;
  declare external_id: string;
  declare title: string;
  declare start_date_time: Date;
  declare end_date_time: Date;
  declare location: string;
  declare description: string;
  declare registration_fee: number;
  declare volunteer_id?: number;
  declare organization_id?: number;
}
