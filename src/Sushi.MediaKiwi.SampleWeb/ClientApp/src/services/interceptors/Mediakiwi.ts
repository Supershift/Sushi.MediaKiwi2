import axios from "axios";

// Interceptor for handling calls to the API
export const mediaKiwiAxiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}/mediakiwi/api}`, // TODO: Fix this so we use the base URL and base route
    headers: {
        "Content-Type": "application/json", // TODO: Add Authentication
    },
    withCredentials: true, // eventually we would want to use credentials for the calls

});
