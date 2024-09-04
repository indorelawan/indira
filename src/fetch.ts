import * as fs from 'fs';

import axios from 'axios';

type TActivityData = {
  success: boolean;
  message: string;
  results: object[];
};

const getActivities = async () => {
  const res = await axios.get<TActivityData>(`https://api.festivalrelawan.com/api/activity/ai`);
  const data = res.data?.results;

  const restructuredData = restructureActivities(data);
  return restructuredData;
};

const writeToFile = (data: any) => {
  fs.writeFileSync('activities.json', JSON.stringify(data, null, 2));
};

const restructureActivities = (data: object[]) => {
  return data;

  //   console.log(JSON.stringify(data, null, 2));

  //   const activities = data.map((activity: any) => {
  //     return {
  //       pageContent: `
  //               Title: ${activity.title}

  //               Description: ${activity.description}

  //               Organization: ${activity.organization.name}
  //               Focuses: ${activity.organization.focuses.join(', ')}

  //               Type: ${activity.type}

  //               Schedules:
  //               Start Date: ${activity.schedules.start_date}, End Date: ${activity.schedules.end_date}
  //               Days: ${activity.schedules.days
  //                 .map((day: any) => `Day: ${day.day}, Start: ${day.start_time}, End: ${day.end_time}`)
  //                 .join('\n')}

  //               Divisions:
  //               ${activity.divisions
  //                 .map(
  //                   (division: any) =>
  //                     `Name: ${division.name}\nJob Description: ${division.jobdesc}\nDuration: ${division.volunteering_duration} hours\nNeed to be Prepared: ${division.need_to_be_prepared}`
  //                 )
  //                 .join('\n\n')}

  //               Location: ${activity.location_data.location}
  //           `,
  //       metadata: {
  //         id: activity._id,
  //         organization: activity.organization.name,
  //         focuses: activity.focuses,
  //         type: activity.type,
  //         schedules: activity.schedules,
  //         registration_deadline: activity.registration_deadline,
  //         location_type: activity.location_type,
  //         volunteers_needed: activity.volunteers_needed,
  //         volunteers: activity.volunteers,
  //         require_cv: activity.require_cv,
  //       },
  //     };
  //   });
  //   return activities;
};

export default getActivities;
