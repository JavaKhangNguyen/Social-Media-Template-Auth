import axiosClient from "./axiosClient";

const userAPI = {
    get: (id: number) => {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
};

export default userAPI