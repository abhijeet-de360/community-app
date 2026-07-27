import axios from "axios";
import { Platform } from "react-native";
import { authHeader } from "../_helper/auth-header";


export const rootUrl = 'http://192.168.1.102:3430/api/v1';


const authUrl = rootUrl + "/user";
const wardUrl = rootUrl + "/ward";

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

async function updateProfile(name: string, email: string) {
    return await axios.patch(authUrl + "/profile", { name, email }, {
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

export const service = {
    sendOtp, verifyOtp, sendRegistrationOtp, registerUser, getProfile, updateProfile, getWards,
};

