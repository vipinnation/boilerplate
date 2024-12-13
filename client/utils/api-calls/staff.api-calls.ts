import URLS from '@/constants/URLS';
import http from '../http.utils';
import handleErrorMessage from '../handle-api-error';

export const StaffAPI = {
    getStaff: async () => {
        return new Promise<{ staff: any[]; pagination: any }>(async (resolve, reject) => {
            try {
                let res = await http.get(URLS.staff);
                resolve(res.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    },

    createStaff: async (data: any) => {
        return new Promise<{ message: string, staff: any }>(async (resolve, reject) => {
            try {
                const response = await http.post(URLS.staff, data);
                resolve(response.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    },

    updateStaff: async (id: string, data: any) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await http.put(`${URLS.staff}/${id}`, data);
                resolve(response.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    },

    deleteStaff: async (id: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await http.delete(`${URLS.staff}/${id}`);
                resolve(response.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    },

    getStaffById: async (id: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await http.get(`${URLS.staff}/${id}`);
                resolve(response.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    },

    blockStaff: async (id: string) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await http.patch(`${URLS.staff}/${id}/block`);
                resolve(response.data);
            } catch (error) {
                console.log(error);
                const errorMessage = handleErrorMessage(error);
                reject(errorMessage);
            }
        });
    }
};
