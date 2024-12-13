import URLS from '@/constants/URLS';
import http from '../http.utils';
import handleErrorMessage from '../handle-api-error';

const getBranch = async () => {
  return new Promise<{ branches: any[]; pagination: any }>(async (resolve, reject) => {
    try {
      let res = await http.get(URLS.branches);
      resolve(res.data);
    } catch (error) {
      console.log(error);
      const errorMessage = handleErrorMessage(error);
      reject(errorMessage);
    }
  });
};

export const BranchesAPI = { getBranch };
