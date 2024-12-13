import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ISchool } from '../model/school.model';
import School from '../model/school.model';
import ServerResponse from '../../library/server-response';
import Logger from '../../library/logger';

export const SchoolController = {
    // Create new school
    create: async (req: Request, res: Response) => {
        try {
            const schoolData: ISchool = req.body;
            const school = new School(schoolData);
            const savedSchool = await school.save();
            return ServerResponse.success(res, { school: savedSchool }, 'School created successfully');
        } catch (error) {
            Logger.error('Error creating school:', error);
            return ServerResponse.serverError(res, { error }, 'Error creating school');
        }
    },

    // Get all schools
    getAll: async (req: Request, res: Response) => {
        try {
            const schools = await School.find();
            return ServerResponse.success(res, { schools });
        } catch (error) {
            Logger.error('Error fetching schools:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching schools');
        }
    },

    // Get school by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid school ID');
            }

            const school = await School.findById(id);
            if (!school) return ServerResponse.badRequest(res, undefined, 'School not found');

            return ServerResponse.success(res, { school });
        } catch (error) {
            Logger.error('Error fetching school:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching school');
        }
    },

    // Update school
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid school ID');


            const updateData: Partial<ISchool> = req.body;
            const updatedSchool = await School.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedSchool) return ServerResponse.badRequest(res, undefined, 'School not found');

            return ServerResponse.success(res, { school: updatedSchool }, 'School updated successfully');
        } catch (error) {
            Logger.error('Error updating school:', error);
            return ServerResponse.serverError(res, { error }, 'Error updating school');
        }
    },

    // Delete school
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid school ID');


            const deletedSchool = await School.findByIdAndDelete(id);
            if (!deletedSchool) return ServerResponse.badRequest(res, undefined, 'School not found');


            return ServerResponse.success(res, undefined, 'School deleted successfully');
        } catch (error) {
            Logger.error('Error deleting school:', error);
            return ServerResponse.serverError(res, { error }, 'Error deleting school');
        }
    }
};
