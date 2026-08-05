import api from "../api/axios";

export const getCategories = async (typeId) => {

    const res = await api.get(`/categories?typeId=${typeId}`);

    return res.data;

}