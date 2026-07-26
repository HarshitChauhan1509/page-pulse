import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function auditWebsite(url) {
    const response = await api.post("/api/v1/audit", {
        url,
    });

    return response.data;
}

export default api;