export type TActivityResponse = {
  success: boolean;
  message: string;
  results: TActivity[];
};

export type TEventMultipleScheduleData = {
  date: string,
  start_time: string
  end_time: string
}

export type TEventRangeScheduleData = {
  start_date: string,
  end_date: string,
  start_time: string,
  end_time: string
}

export type TRegularScheduleData = {
  start_date: string,
  end_date: string,
  days: {
    day: string,
    start_time: string,
    end_time: string
  }[]
}

export type TProjectScheduleData = {
  start_date: string,
  end_date: string
}

export type TActivityFixedLocationData = {
  street: string,
  zipcode: string,
  province: string,
  regency_city: string
}

export type TActivityFlexibleLocationData = {
  location: string
}

export type TActivity = {
  _id: string,
  title: string,
  description: string
  organization: {
    name: string
    focuses: string[]
  },
  type: string,
  events_type: string,
  schedules: TEventMultipleScheduleData[] | TEventRangeScheduleData | TRegularScheduleData | TProjectScheduleData,
  divisions: {
    name: string,
    jobdesc: string,
    volunteering_duration: number,
    need_to_be_prepared: string,
    province: string,
    additional_information: string
  }[],
  focuses: string[],
  registration_deadline: string,
  location_type: string,
  location_data: TActivityFixedLocationData | TActivityFlexibleLocationData,
  volunteers_needed: number,
  volunteers: number,
  require_cv: boolean
}