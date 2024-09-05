import * as fs from 'fs';

import axios from 'axios';
import { TActivity, TActivityResponse, TEventMultipleScheduleData, TEventRangeScheduleData, TActivityFixedLocationData, TActivityFlexibleLocationData, TProjectScheduleData, TRegularScheduleData } from './types';
import { config } from './config';


const getActivities = async () => {
  const res = await axios.get<TActivityResponse>(`https://api.festivalrelawan.com/api/activity/ai`);
  const data = (res.data as TActivityResponse).results;

  const restructuredData = restructureActivities(data);
  return restructuredData;
};


const restructureActivities = (data: TActivity[]) => {
  const activities = data.map((activity: TActivity, index: number) => {

    const getSchedules = () => {
      if (activity.type === 'event') {
        if (activity.events_type === 'multiple') {
          const sched = activity.schedules as TEventMultipleScheduleData[]
          const mapped = sched.map((schedule: TEventMultipleScheduleData) => `Tanggal kegiatan: ${schedule.date}
Dimulai pukul ${schedule.start_time}
Berakhir pukul ${schedule.end_time}`)
          return mapped.join(`
`)
        }

        if (activity.events_type === 'range') {
          const sched = activity.schedules as TEventRangeScheduleData
          return `Tanggal kegiatan: ${sched.start_date} - ${sched.end_date}
Dimulai pukul ${sched.start_time}
Berakhir pukul ${sched.end_time}`
        }
      }

      if (activity.type === 'project') {
        const sched = activity.schedules as TProjectScheduleData
        return `Tanggal kegiatan: ${sched.start_date} - ${sched.end_date}`
      }

      if (activity.type === 'regular') {
        const sched = activity.schedules as TRegularScheduleData
        const days = sched.days.map((d: any) => `- ${d.day}, ${d.start_time} - ${d.end_time}`).join(`
`)

        return `Tanggal kegiatan: ${sched.start_date} - ${sched.end_date}
Jadwal:
${days}`
      }
    }

    const getLocation = () => {
      if (activity.location_type === 'fixed') {
        const loc = activity.location_data as TActivityFixedLocationData
        return `Lokasi:
Nama Jalan: ${loc.street}
Provinsi: ${loc.province}
Kota: ${loc.regency_city}
Kode Pos: ${loc.zipcode}`
      }
      if (activity.location_type === 'flexible') {
        const loc = activity.location_data as TActivityFlexibleLocationData
        return `Lokasi:
${loc.location}`
      }

      return ''
    }


    return {
      pageContent: `
${index + 1}. ${activity.title}
Link Aktivitas: [${config.baseUrl}/activity/${activity._id}](${config.baseUrl}/activity/${activity._id})
Organisasi: ${activity.organization.name}
Fokus: ${activity.organization.focuses.join(', ')}
Tipe Aktivitas: ${activity.type}
Batas Pendaftaran: ${activity.registration_deadline}
Jadwal:
${getSchedules()}
${getLocation()}
Divisi:
${activity.divisions.map(
        (division: any) => `1. ${division.name}
   Durasi: ${division.volunteering_duration} hours
   Perlengkapan: ${division.need_to_be_prepared}`)
          .join(`
---`)}
: ${activity.volunteers_needed}
Membutuhkan CV: ${activity.require_cv ? 'Ya' : 'Tidak'}`,
      metadata: {
        id: activity._id,
        title: activity.title,
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
