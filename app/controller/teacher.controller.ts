import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../library/server-response';
import Logger from '../../library/logger';
import Teacher, { ITeacher } from '../model/teacher.model';

const TeacherController = {
    // Create new teacher
    create: async (req: Request, res: Response) => {
        try {
            const teacherData: ITeacher = req.body;
            const teacher = new Teacher(teacherData);
            const savedTeacher = await teacher.save();
            return ServerResponse.success(res, { teacher: savedTeacher }, 'Teacher created successfully');
        } catch (error) {
            Logger.error('Error creating teacher:', error);
            return ServerResponse.serverError(res, { error }, 'Error creating teacher');
        }
    },

    // Get all teachers
    getAll: async (req: Request, res: Response) => {
        try {
            const teachers = await Teacher.find();
            return ServerResponse.success(res, { teachers });
        } catch (error) {
            Logger.error('Error fetching teachers:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching teachers');
        }
    },

    // Get teacher by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid teacher ID');
            }

            const teacher = await Teacher.findById(id);
            if (!teacher) return ServerResponse.badRequest(res, undefined, 'Teacher not found');

            return ServerResponse.success(res, { teacher });
        } catch (error) {
            Logger.error('Error fetching teacher:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching teacher');
        }
    },

    // Update teacher
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid teacher ID');
            }

            const updateData: Partial<ITeacher> = req.body;
            const updatedTeacher = await Teacher.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedTeacher) return ServerResponse.badRequest(res, undefined, 'Teacher not found');

            return ServerResponse.success(res, { teacher: updatedTeacher }, 'Teacher updated successfully');
        } catch (error) {
            Logger.error('Error updating teacher:', error);
            return ServerResponse.serverError(res, { error }, 'Error updating teacher');
        }
    },

    // Delete teacher
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid teacher ID');
            }

            const deletedTeacher = await Teacher.findByIdAndDelete(id);
            if (!deletedTeacher) return ServerResponse.badRequest(res, undefined, 'Teacher not found');

            return ServerResponse.success(res, undefined, 'Teacher deleted successfully');
        } catch (error) {
            Logger.error('Error deleting teacher:', error);
            return ServerResponse.serverError(res, { error }, 'Error deleting teacher');
        }
    }
};

export default TeacherController;
