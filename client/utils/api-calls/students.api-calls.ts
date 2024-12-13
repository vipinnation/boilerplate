import URLS from '@/constants/URLS';
import http from '../http.utils';
import handleErrorMessage from '../handle-api-error';

const getStudents = async () => {
    return new Promise<{ students: any[]; pagination: any }>(async (resolve, reject) => {
        try {
            let res = await http.get(URLS.students);
            resolve(res.data);
        } catch (error) {
            console.log(error);
            const errorMessage = handleErrorMessage(error);
            reject(errorMessage);
        }
    });
};

const createStudent = async (data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await http.post(URLS.students, data);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            const errorMessage = handleErrorMessage(error);
            reject(errorMessage);
        }
    });
};

const updateStudent = async (id: string, data: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await http.put(`${URLS.students}/${id}`, data);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            const errorMessage = handleErrorMessage(error);
            reject(errorMessage);
        }
    });
};

const deleteStudent = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await http.delete(`${URLS.students}/${id}`);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            const errorMessage = handleErrorMessage(error);
            reject(errorMessage);
        }
    });
};

const getStudentById = async (id: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await http.get(`${URLS.students}/${id}`);
            resolve(response.data);
        } catch (error) {
            console.log(error);
            const errorMessage = handleErrorMessage(error);
            reject(errorMessage);
        }
    });
};

export const StudentsAPI = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById
};
