import axios from "axios";
import { Platform } from "react-native";
import { authHeader } from "../_helper/auth-header";


export const rootUrl = 'http://192.168.1.102:3430/api/v1';


const authUrl = rootUrl + "/user";
const wardUrl = rootUrl + "/ward";
const contactsUrl = rootUrl + "/important-contacts";
const announcementUrl = rootUrl + "/announcement";
const sanitationUrl = rootUrl + "/sanitation";
const govtSchemeUrl = rootUrl + "/govt-scheme";
const emergencyUrl = rootUrl + "/emergency-alert";
const campaignUrl = rootUrl + "/campaign";
const notificationUrl = rootUrl + "/notification";

// ========== auth ==========

async function sendOtp(phoneNumber: string) {
    return await axios.post(authUrl + "/sendOtp", { phoneNumber });
};

async function verifyOtp(data:any) {
    return await axios.post(authUrl + "/verifyOtp", data);
};

async function getProfile() {
    return await axios.get(authUrl + "/myprofile", {
        headers: await authHeader("")
    });
};

async function updateProfile(data: any) {
    return await axios.patch(authUrl + "/profile", data, {
        headers: await authHeader("")
    });
};

async function updateReminder(reminderEnabled: boolean) {
    return await axios.patch(authUrl + "/reminder", { reminderEnabled }, {
        headers: await authHeader("")
    });
};

async function sendRegistrationOtp(phoneNumber: string) {
    return await axios.post(authUrl + "/sendRegistrationOtp", { phoneNumber });
};

async function registerUser(formData: FormData) {
    return await axios.post(authUrl + "/register", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

async function getWards() {
    return await axios.get(wardUrl + "/list");
};

async function getImportantContacts(params?: { wardId?: string; search?: string; type?: string }) {
    return await axios.get(contactsUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function getAnnouncements(params?: { wardId?: string; search?: string; category?: string; page?: number; limit?: number }) {
    return await axios.get(announcementUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function getSanitationSchedule(params?: { wardId?: string }) {
    return await axios.get(sanitationUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function getGovtSchemes(params?: { wardId?: string; search?: string; category?: string }) {
    return await axios.get(govtSchemeUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function getEmergencyAlerts(params?: { wardId?: string }) {
    return await axios.get(emergencyUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function getCampaigns(params?: { wardId?: string }) {
    return await axios.get(campaignUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};


async function getNotifications(params?: { wardId?: string; userId?: string }) {
    return await axios.get(notificationUrl + "/user", {
        headers: await authHeader(""),
        params,
    });
};

async function markNotificationRead(id: string, userId: string) {
    return await axios.patch(notificationUrl + `/${id}/read`, { userId }, {
        headers: await authHeader(""),
    });
};

async function markAllNotificationsRead(params?: { wardId?: string; userId?: string }) {
    return await axios.patch(notificationUrl + "/read-all", {}, {
        headers: await authHeader(""),
        params,
    });
};

export const service = {
    sendOtp, verifyOtp, sendRegistrationOtp, registerUser, getProfile, updateProfile, updateReminder, getWards, getImportantContacts, getAnnouncements, getSanitationSchedule, getGovtSchemes, getEmergencyAlerts, getCampaigns, getNotifications, markNotificationRead, markAllNotificationsRead,
};

