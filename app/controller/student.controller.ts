import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServerResponse from '../../library/server-response';
import Logger from '../../library/logger';
import Student, { IStudent } from '../model/students.model';

const StudentController = {
    // Create new student
    create: async (req: Request, res: Response) => {
        try {
            const studentData: IStudent = req.body;
            const student = new Student(studentData);
            const savedStudent = await student.save();
            return ServerResponse.success(res, { student: savedStudent }, 'Student created successfully');
        } catch (error) {
            Logger.error('Error creating student:', error);
            return ServerResponse.serverError(res, { error }, 'Error creating student');
        }
    },

    // Get all students
    getAll: async (req: Request, res: Response) => {
        try {
            const students = await Student.find();
            return ServerResponse.success(res, { students });
        } catch (error) {
            Logger.error('Error fetching students:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching students');
        }
    },

    // Get student by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid student ID');
            }

            const student = await Student.findById(id);
            if (!student) return ServerResponse.badRequest(res, undefined, 'Student not found');

            return ServerResponse.success(res, { student });
        } catch (error) {
            Logger.error('Error fetching student:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching student');
        }
    },

    // Update student
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid student ID');
            }

            const updateData: Partial<IStudent> = req.body;
            const updatedStudent = await Student.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedStudent) return ServerResponse.badRequest(res, undefined, 'Student not found');

            return ServerResponse.success(res, { student: updatedStudent }, 'Student updated successfully');
        } catch (error) {
            Logger.error('Error updating student:', error);
            return ServerResponse.serverError(res, { error }, 'Error updating student');
        }
    },

    // Delete student
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid student ID');
            }

            const deletedStudent = await Student.findByIdAndDelete(id);
            if (!deletedStudent) return ServerResponse.badRequest(res, undefined, 'Student not found');

            return ServerResponse.success(res, undefined, 'Student deleted successfully');
        } catch (error) {
            Logger.error('Error deleting student:', error);
            return ServerResponse.serverError(res, { error }, 'Error deleting student');
        }
    }
};

export default StudentController;
