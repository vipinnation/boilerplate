import { Response } from 'express';

interface ResponseData {
  [key: string]: any;
}

const ServerResponse = {
  success: (res: Response, data?: ResponseData, message: string = 'Success') => {
    return res.status(200).json({
      success: true,
      message,
      ...(data || {})
    });
  },

  badRequest: (res: Response, data?: ResponseData, message: string = 'Bad Request') => {
    return res.status(400).json({
      success: false,
      message,
      ...(data || {})
    });
  },

  forbidden: (res: Response, data?: ResponseData, message: string = 'Forbidden Access') => {
    return res.status(403).json({
      success: false,
      message,
      ...(data || {})
    });
  },

  serverError: (res: Response, data?: ResponseData, message: string = 'Internal Server Error') => {
    return res.status(500).json({
      success: false,
      message,
      ...(data || {})
    });
  }
};




export default ServerResponse;
