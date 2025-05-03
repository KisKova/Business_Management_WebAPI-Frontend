import api from "./api.js"

/**************** Google Ads Report requests ****************/

// Fetch all google ads accounts
export const fetchAllAccounts = async () => {
    return api.get(`/google-ads/accounts`);
};

// Create a Google Ads Campaign report
export const createReport = async (id, name, month) => {
    return api.post(`/google-ads/report`, { customerId: id, customerName: name, month: month },{responseType: "blob"});
};