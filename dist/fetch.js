"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("./config");
const getActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, node_fetch_1.default)(config_1.config.activityUrl);
    const data = yield res.json();
    if (!data) {
        throw new Error('Failed to fetch activities');
    }
    const restructuredData = restructureActivities(data['results']);
    return restructuredData;
});
const restructureActivities = (data) => {
    console.log(typeof data);
    const activities = data.map((activity) => {
        return {
            pageContent: `
            Title: ${activity.title}
    
            Description: ${activity.description}
    
            Organization: ${activity.organization.name}
            Focuses: ${activity.organization.focuses.join(', ')}
    
            Type: ${activity.type}
    
            Schedules:
            Start Date: ${activity.schedules.start_date}, End Date: ${activity.schedules.end_date}
            Days: ${activity.schedules.days
                .map((day) => `Day: ${day.day}, Start: ${day.start_time}, End: ${day.end_time}`)
                .join('\n')}
    
            Divisions:
            ${activity.divisions
                .map((division) => `Name: ${division.name}\nJob Description: ${division.jobdesc}\nDuration: ${division.volunteering_duration} hours\nNeed to be Prepared: ${division.need_to_be_prepared}`)
                .join('\n\n')}
    
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
exports.default = getActivities;
