import axios from 'axios';

const handleErrorMessage = (error: any) => {
    console.log(typeof (error));

    if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.msg === "Session expired") {
            return "Session expired";
        } else if (error.response.data && error.response.data.msg) {
            return error.response.data.msg;
        }
        if (error.code === "ERR_NETWORK") {
            return "Network issue, Try after some time";
        }
    } else if (typeof (error) === "string") {
        return error;
    }
    else {
        return "Something went wrong Please Try Again";
    }

};
export default handleErrorMessage