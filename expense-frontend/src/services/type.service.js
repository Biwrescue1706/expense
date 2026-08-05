import api from "../api/axios";

export const getTypes = async () => {

    const res = await api.get("/types");

    return res.data;

}