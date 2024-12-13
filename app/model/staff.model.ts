import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';
import { IUser } from './user.model';

export interface IStaff extends Document {
    user: mongoose.Types.ObjectId | IUser;
    school: mongoose.Types.ObjectId;
    employeeId: string;
    department: string;
    position: string;
    workHours?: {
        start: string;
        end: string;
    };
    salary?: {
        baseSalary: number;
        allowances?: number;
        deductions?: number;
    };
    contactInformation?: {
        workEmail?: string;
        workPhone?: string;
        emergencyContact?: {
            name: string;
            relationship: string;
            phone: string;
        }
    };
    performanceReviews?: Array<{
        year: number;
        rating: number;
        remarks?: string;
    }>;
    isActive: boolean;
    isDeleted: boolean;
}

const StaffSchema: Schema = new Schema<IStaff>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.users,
            deafult: null
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.school, default: null
        },
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true
        },
        workHours: {
            start: {
                type: String,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time format. Use HH:MM']
            },
            end: {
                type: String,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time format. Use HH:MM']
            }
        },
        salary: {
            baseSalary: {
                type: Number,
                min: [0, 'Salary cannot be negative']
            },
            allowances: {
                type: Number,
                default: 0,
                min: [0, 'Allowances cannot be negative']
            },
            deductions: {
                type: Number,
                default: 0,
                min: [0, 'Deductions cannot be negative']
            }
        },
        contactInformation: {
            workEmail: {
                type: String,
                lowercase: true,
                trim: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid work email address']
            },
            workPhone: {
                type: String,
                match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid work phone number']
            },
            emergencyContact: {
                name: {
                    type: String,
                    trim: true
                },
                relationship: {
                    type: String,
                    trim: true
                },
                phone: {
                    type: String,
                    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
                }
            }
        },
        performanceReviews: [{
            year: {
                type: Number,
                min: [1900, 'Invalid year']
            },
            rating: {
                type: Number,
                min: [0, 'Rating cannot be negative'],
                max: [10, 'Rating cannot exceed 10']
            },
            remarks: {
                type: String,
                trim: true
            }
        }],
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: DB_NAMES.staff
    }
);

StaffSchema.index({ employeeId: 1, school: 1 }, { unique: true });


const Staffs: Model<IStaff> = mongoose.model<IStaff>(DB_NAMES.staff, StaffSchema);

export default Staffs;