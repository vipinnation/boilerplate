import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IStaff } from '../model/staff.model';
import Staff from '../model/staff.model';
import ServerResponse from '../../library/server-response';
import Logger from '../../library/logger';
import User from '../model/user.model';
import PasswordProcess from '../../library/password.process';

const StaffController = {
    // Create new staff member
    create: async (req: Request, res: Response) => {
        try {
            const staffData: IStaff = req.body;

            let { firstName, lastName, email, password, phone, } = req.body

            let encryptedPassword = await PasswordProcess.encrypt(`${Math.random() * 1e12}`)
            let user = new User({ firstName, lastName, email, password: encryptedPassword, phone, role: "ROLE_STAFF", })

            let savedUser = await user.save()
            staffData.user = savedUser._id
            const staff = new Staff(staffData);

            await staff.save();

            const savedStaff: any = await Staff.findById(staff._id).populate("user");

            await User.findByIdAndUpdate(savedUser._id, { $set: { staff: savedStaff._id } });
            return ServerResponse.success(res, { staff: savedStaff }, 'Staff member added successfully');
        } catch (error: any) {
            Logger.error('Error creating staff member:', error);
            if (error.code == 11000 && error.keyPattern.email) return ServerResponse.badRequest(res, { msg: "Staff member already exists with this email" }, 'Error creating staff member');
            if (error.code == 11000 && error.keyPattern.employeeId) return ServerResponse.badRequest(res, { msg: "Staff member already exists with this employee id" }, 'Error creating staff member');
            return ServerResponse.serverError(res, { error }, 'Error creating staff member');
        }
    },

    // Get all staff members
    getAll: async (req: Request, res: Response) => {
        try {
            const staffMembers = await Staff.find({ isActive: true, isDeleted: false }).populate("user");
            return ServerResponse.success(res, { staff: staffMembers });
        } catch (error) {
            Logger.error('Error fetching staff members:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching staff members');
        }
    },

    // Get staff member by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid staff ID');


            const staff = await Staff.findById(id).populate("user");
            if (!staff) return ServerResponse.badRequest(res, undefined, 'Staff member not found');

            return ServerResponse.success(res, { staff });
        } catch (error) {
            Logger.error('Error fetching staff member:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching staff member');
        }
    },

    // Update staff member
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid staff ID');


            const updateData: Partial<IStaff> = req.body;
            let updatedStaff = await Staff.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            await User.findByIdAndUpdate(updatedStaff?.user, { $set: req.body });

            if (!updatedStaff) return ServerResponse.badRequest(res, undefined, 'Staff member not found');

            updatedStaff = await Staff.findById(id).populate("user");
            return ServerResponse.success(res, { staff: updatedStaff }, 'Staff member updated successfully');
        } catch (error) {
            Logger.error('Error updating staff member:', error);
            return ServerResponse.serverError(res, { error }, 'Error updating staff member');
        }
    },

    // Delete staff member
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid staff ID');


            const deletedStaff = await Staff.findByIdAndUpdate(id, { $set: { isActive: false, isDeleted: true } });
            await User.findByIdAndUpdate(deletedStaff?.user, { $set: { isActive: false, isDeleted: true } });
            if (!deletedStaff) return ServerResponse.badRequest(res, undefined, 'Staff member not found');

            return ServerResponse.success(res, undefined, 'Staff member removed successfully');
        } catch (error) {
            Logger.error('Error deleting staff member:', error);
            return ServerResponse.serverError(res, { error }, 'Error deleting staff member');
        }
    },
    // Block staff member
    block: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return ServerResponse.badRequest(res, undefined, 'Invalid staff ID');

            const staff = await Staff.findByIdAndUpdate(
                id,
                { $set: { isActive: false } },
                { new: true }
            );

            if (!staff) return ServerResponse.badRequest(res, undefined, 'Staff member not found');

            await User.findByIdAndUpdate(
                staff.user,
                { $set: { isActive: false, isBlocked: true } }
            );

            return ServerResponse.success(res, undefined, 'Staff member blocked successfully');
        } catch (error) {
            Logger.error('Error blocking staff member:', error);
            return ServerResponse.serverError(res, { error }, 'Error blocking staff member');
        }
    },

};

export default StaffController;
