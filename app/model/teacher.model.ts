import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';

export interface ITeacher extends Document {
    userId: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;
    employeeId: string;
    department?: string;
    qualifications: string[];
    subjects: string[];
    dateOfJoining: Date;
    specializations?: string[];
    contactInformation: {
        emergencyContact?: {
            name: string;
            relationship: string;
            phone: string;
        }
    };
    salary?: {
        baseSalary: number;
        allowances?: number;
        deductions?: number;
    };
    performanceReviews?: Array<{
        year: number;
        rating: number;
        remarks?: string;
    }>;
    isActive: boolean;
}

const TeacherSchema: Schema = new Schema<ITeacher>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.users,
            required: [true, 'User reference is required']
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.school,
            required: [true, 'School reference is required']
        },
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true
        },
        department: {
            type: String,
            trim: true
        },
        qualifications: [{
            type: String,
            trim: true
        }],
        subjects: [{
            type: String,
            trim: true
        }],
        dateOfJoining: {
            type: Date,
            required: [true, 'Date of joining is required']
        },
        specializations: [{
            type: String,
            trim: true
        }],
        contactInformation: {
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
        }
    },
    {
        timestamps: true,
        collection: DB_NAMES.teachers
    }
);

TeacherSchema.index({ employeeId: 1, school: 1 }, { unique: true });

const Teacher: Model<ITeacher> = mongoose.model<ITeacher>(DB_NAMES.teachers, TeacherSchema);

export default Teacher;