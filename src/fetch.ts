import * as fs from 'fs';

import axios from 'axios';

type TActivityData = {
  success: boolean;
  message: string;
  results: object[];
};

const getActivities = async () => {
  const res = await axios.get<TActivityData>(`https://api.festivalrelawan.com/api/activity/ai`);
  const data = (res.data as TActivityData).results;

  const restructuredData = restructureActivities(data);
  return restructuredData;
};


const restructureActivities = (data: object[]) => {
  const activities = data.map((activity: any) => {

    const getSchedules = () => {
      if (activity.type === 'event') {
        if (activity.events_type === 'multiple') {
          const mapped = activity.schedules.map((schedule: any) => `
                Date: ${schedule.date}
                Start Time: ${schedule.start_time}
                End Time: ${schedule.end_time}
          `)
          return mapped.join(`
`)
        }

        if (activity.events_type === 'range') {
          return `
                Start Date: ${activity.schedules.start_date}
                End Date: ${activity.schedules.end_date}
                Start Time: ${activity.schedules.start_time}
                End Time: ${activity.schedules.end_time}
          `
        }
      }

      if (activity.type === 'project') {
        return `
                Start Date: ${activity.schedules.start_date}
                End Date: ${activity.schedules.end_date}
                
`
      }

      if (activity.type === 'regular') {
        const days = activity.schedules.days.map((d: any) => `- ${d.day}, ${d.start_time} - ${d.end_time}`).join(`
`)


        return `
                Start Date: ${activity.schedules.start_date}
                End Date: ${activity.schedules.end_date}
                Days:
                ${days}
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
            (division: any) =>
              `Name: ${division.name}\nJob Description: ${division.jobdesc}\nDuration: ${division.volunteering_duration} hours\nNeed to be Prepared: ${division.need_to_be_prepared}`
          )
          .join('\n\n')
        }

                Location: ${activity.location_data.location}
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
