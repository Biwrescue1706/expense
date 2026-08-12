import api from "../api/axios";

export const getTransactions = async (year) => {
    const params = year ? { year } : {};

    const response = await api.get("/transactions", {
        params,
    });

    return response.data.data;
};

export const createTransaction = async (data) => {
    const res = await api.post(
        "/transactions",
        data
    );

    return res.data;
};

export const updateTransaction = async (id, data) => {
    const res = await api.patch(
        `/transactions/${id}`,
        data
    );

    return res.data;
};

export const deleteTransaction = async (id) => {
    const res = await api.delete(
        `/transactions/${id}`
    );

    return res.data;
};