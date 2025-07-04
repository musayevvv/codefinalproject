import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        console.error("fetchDataFromApi error:", error);
        return [];
    }
};

export const postData = async (url, formData) => {
    try {
        const { data } = await api.post(url, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return data;
    } catch (error) {
        console.error("postData error:", error);
        throw error;
    }
};



export const editData = async (url, updatedData) => {
    const { data } = await api.put(url, updatedData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return data;
};

export const deleteData = async (url) => {
    const { data } = await api.delete(url);
    return data;
};

export const uploadImage = async (url, formData) => {
    const { data } = await api.post(url, formData);
    return data;
};

export const deleteImages = async (url, image) => {
    const { data } = await api.delete(url, { data: image });
    return data;
};

export default api;
