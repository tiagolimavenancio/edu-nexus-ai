export interface IPediod {
  _id: string;
  subject: { _id: string; name: string; code: string };
  teacher: { _id: string; name: string };
  startTime: string;
  endTime: string;
}

export interface ISchedule {
  day: string;
  periods: IPediod[];
}
