import axios from "axios";

const token = localStorage.getItem("token");

const params = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
};


export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + url, params);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};


export const postData = async (url, formData) => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


export const editData = async (url, updatedData) => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}${url}`, updatedData, params);
    return data;
};

export const deleteData = async (url) => {
    const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`, params);
    return data;
};

export const uploadImage = async (url, formData) => {
    const { data } = await axios.post(import.meta.env.VITE_API_URL + url, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return data;
};

export const deleteImages = async (url, image) => {
    const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data: image,
    });
    return data;
};
