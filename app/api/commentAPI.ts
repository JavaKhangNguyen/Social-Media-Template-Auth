import axiosClient from "./axiosClient";

const commentAPI = {
  getAll: (params) => {
    const url = "/comments";
    return axiosClient.get(url, { params });
  },

  get: (id: number) => {
    const url = `/comments/${id}`;
    return axiosClient.get(url);
  },

  add: (data) => {
    const url = "/comments";
    return axiosClient.post(url, data);
  },

  update: (data) => {
    const url = `/comments/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove: (id) => {
    const url = `/comments/${id}`;
    return axiosClient.delete(url);
  },
};

export default commentAPI;