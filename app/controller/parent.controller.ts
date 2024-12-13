import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IParent } from '../model/parent.model';
import Parent from '../model/parent.model';
import ServerResponse from '../../library/server-response';
import Logger from '../../library/logger';

const ParentController = {
    // Create new parent
    create: async (req: Request, res: Response) => {
        try {
            const parentData: IParent = req.body;
            const parent = new Parent(parentData);
            const savedParent = await parent.save();
            return ServerResponse.success(res, { parent: savedParent }, 'Parent created successfully');
        } catch (error) {
            Logger.error('Error creating parent:', error);
            return ServerResponse.serverError(res, { error }, 'Error creating parent');
        }
    },

    // Get all parents
    getAll: async (req: Request, res: Response) => {
        try {
            const parents = await Parent.find();
            return ServerResponse.success(res, { parents });
        } catch (error) {
            Logger.error('Error fetching parents:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching parents');
        }
    },

    // Get parent by ID
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid parent ID');
            }

            const parent = await Parent.findById(id);
            if (!parent) return ServerResponse.badRequest(res, undefined, 'Parent not found');

            return ServerResponse.success(res, { parent });
        } catch (error) {
            Logger.error('Error fetching parent:', error);
            return ServerResponse.serverError(res, { error }, 'Error fetching parent');
        }
    },

    // Update parent
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid parent ID');
            }

            const updateData: Partial<IParent> = req.body;
            const updatedParent = await Parent.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedParent) return ServerResponse.badRequest(res, undefined, 'Parent not found');

            return ServerResponse.success(res, { parent: updatedParent }, 'Parent updated successfully');
        } catch (error) {
            Logger.error('Error updating parent:', error);
            return ServerResponse.serverError(res, { error }, 'Error updating parent');
        }
    },

    // Delete parent
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ServerResponse.badRequest(res, undefined, 'Invalid parent ID');
            }

            const deletedParent = await Parent.findByIdAndDelete(id);
            if (!deletedParent) return ServerResponse.badRequest(res, undefined, 'Parent not found');

            return ServerResponse.success(res, undefined, 'Parent deleted successfully');
        } catch (error) {
            Logger.error('Error deleting parent:', error);
            return ServerResponse.serverError(res, { error }, 'Error deleting parent');
        }
    }
};



export default ParentController;
