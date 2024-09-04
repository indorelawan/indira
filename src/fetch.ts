import * as fs from 'fs';

import axios from 'axios';
import { TActivity, TActivityResponse, TEventMultipleScheduleData, TEventRangeScheduleData, TActivityFixedLocationData, TActivityFlexibleLocationData, TProjectScheduleData, TRegularScheduleData } from './types';


const getActivities = async () => {
  const res = await axios.get<TActivityResponse>(`https://api.festivalrelawan.com/api/activity/ai`);
  const data = (res.data as TActivityResponse).results;

  const restructuredData = restructureActivities(data);
  return restructuredData;
};


const restructureActivities = (data: TActivity[]) => {
  const activities = data.map((activity: TActivity) => {

    const getSchedules = () => {
      if (activity.type === 'event') {
        if (activity.events_type === 'multiple') {
          const sched = activity.schedules as TEventMultipleScheduleData[]
          const mapped = sched.map((schedule: TEventMultipleScheduleData) => `
                Date: ${schedule.date}
                Start Time: ${schedule.start_time}
                End Time: ${schedule.end_time}
          `)
          return mapped.join(`
`)
        }

        if (activity.events_type === 'range') {
          const sched = activity.schedules as TEventRangeScheduleData
          return `
                Start Date: ${sched.start_date}
                End Date: ${sched.end_date}
                Start Time: ${sched.start_time}
                End Time: ${sched.end_time}
          `
        }
      }

      if (activity.type === 'project') {
        const sched = activity.schedules as TProjectScheduleData
        return `
                Start Date: ${sched.start_date}
                End Date: ${sched.end_date}
                
`
      }

      if (activity.type === 'regular') {
        const sched = activity.schedules as TRegularScheduleData
        const days = sched.days.map((d: any) => `- ${d.day}, ${d.start_time} - ${d.end_time}`).join(`
`)


        return `
                Start Date: ${sched.start_date}
                End Date: ${sched.end_date}
                Days:
                ${days}
`
      }
    }

    const getLocation = () => {
      if (activity.location_type === 'fixed') {
        const loc = activity.location_data as TActivityFixedLocationData
        return `
                Location:
                Street: ${loc.street}
                Zipcode: ${loc.zipcode}
                Province: ${loc.province}
                Regency City: ${loc.regency_city}
`
      }
      if (activity.location_type === 'flexible') {
        const loc = activity.location_data as TActivityFlexibleLocationData
        return `
                ${loc.location}
`
      }
    }


    return {
      pageContent: `
                Title: ${activity.title}

                Description: ${activity.description}

                Organization: ${activity.organization.name}
                Focuses: ${activity.organization.focuses.join(', ')}

                Type: ${activity.type}

                Schedule(s):
${getSchedules()}

                Divisions:
            ${activity.divisions
          .map(
            (division: any) => `
                Name: ${division.name}
                Job Description: ${division.jobdesc}
                Duration: ${division.volunteering_duration} hours
                Need to be Prepared: ${division.need_to_be_prepared}`
          )
          .join(`
`)
        }

                ${getLocation()}
            `,
      metadata: {
        id: activity._id,
        organization: activity.organization.name,
        focuses: activity.focuses,
        type: activity.type,
        schedules: activity.schedules,
        registration_deadline: activity.registration_deadline,
        location_type: activity.location_type,
        volunteers_needed: activity.volunteers_needed,
        volunteers: activity.volunteers,
        require_cv: activity.require_cv,
      },
    };
  });
  return activities;
};

export default getActivities;
