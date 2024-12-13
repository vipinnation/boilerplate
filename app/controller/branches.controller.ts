import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Branch, { IBranch } from '../model/branches.model';

// Create a new branch
export const createBranch = async (req: Request, res: Response) => {
    try {
        const branchData: IBranch = req.body;

        // Validate school ID
        if (!mongoose.Types.ObjectId.isValid(branchData.school)) {
            return res.status(400).json({
                message: 'Invalid school ID',
                success: false
            });
        }

        const newBranch = new Branch(branchData);
        await newBranch.save();

        res.status(201).json({
            message: 'Branch created successfully',
            data: newBranch,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Error creating branch',
            error: error.message,
            success: false
        });
    }
};

// Get all branches with pagination and filtering
export const getAllBranches = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            school
        } = req.query;

        const filter: any = {};
        if (status) filter.status = status;
        if (school) filter.school = school;

        const branches = await Branch.find(filter)
            .populate('school', 'name')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Branch.countDocuments(filter);

        res.status(200).json({
            message: 'Branches retrieved successfully',
            data: branches,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalBranches: total
            },
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving branches',
            error: error.message,
            success: false
        });
    }
};

// Get a single branch by ID
export const getBranchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid branch ID',
                success: false
            });
        }

        const branch = await Branch.findById(id).populate('school', 'name');

        if (!branch) {
            return res.status(404).json({
                message: 'Branch not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Branch retrieved successfully',
            data: branch,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving branch',
            error: error.message,
            success: false
        });
    }
};

// Update a branch
export const updateBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData: Partial<IBranch> = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid branch ID',
                success: false
            });
        }

        if (updateData.school && !mongoose.Types.ObjectId.isValid(updateData.school)) {
            return res.status(400).json({
                message: 'Invalid school ID',
                success: false
            });
        }

        const updatedBranch = await Branch.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('school', 'name');

        if (!updatedBranch) {
            return res.status(404).json({
                message: 'Branch not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Branch updated successfully',
            data: updatedBranch,
            success: true
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Error updating branch',
            error: error.message,
            success: false
        });
    }
};

// Delete a branch
export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid branch ID',
                success: false
            });
        }

        const deletedBranch = await Branch.findByIdAndDelete(id);

        if (!deletedBranch) {
            return res.status(404).json({
                message: 'Branch not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Branch deleted successfully',
            data: deletedBranch,
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error deleting branch',
            error: error.message,
            success: false
        });
    }
};