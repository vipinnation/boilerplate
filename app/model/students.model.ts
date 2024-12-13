import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';

export interface IStudent extends Document {
    userId: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;
    studentId: string;
    admissionDate: Date;
    grade: string;
    class?: string;
    academicInfo: {
        currentAcademicYear: number;
        previousYearPerformance?: {
            year: number;
            grades: { [subject: string]: string }
        }
    };
    guardians: Array<{
        relationship: string;
        userId?: mongoose.Types.ObjectId;
        name: string;
        contactInfo: string;
    }>;
    extracurricularActivities?: string[];
    healthInformation?: {
        medicalConditions?: string[];
        allergies?: string[];
        emergencyContact?: {
            name: string;
            relationship: string;
            phone: string;
        }
    };
    isActive: boolean;
}

const StudentSchema: Schema = new Schema<IStudent>(
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
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true
        },
        admissionDate: {
            type: Date,
            required: [true, 'Admission date is required']
        },
        grade: {
            type: String,
            required: [true, 'Grade is required'],
            trim: true
        },
        class: {
            type: String,
            trim: true
        },
        academicInfo: {
            currentAcademicYear: {
                type: Number,
                required: [true, 'Current academic year is required'],
                min: [1900, 'Invalid year']
            },
            previousYearPerformance: {
                year: {
                    type: Number,
                    min: [1900, 'Invalid year']
                },
                grades: {
                    type: Map,
                    of: String
                }
            }
        },
        guardians: [{
            relationship: {
                type: String,
                required: [true, 'Guardian relationship is required'],
                trim: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: DB_NAMES.users
            },
            name: {
                type: String,
                required: [true, 'Guardian name is required'],
                trim: true
            },
            contactInfo: {
                type: String,
                required: [true, 'Guardian contact info is required'],
                match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid contact number']
            }
        }],
        extracurricularActivities: [{
            type: String,
            trim: true
        }],
        healthInformation: {
            medicalConditions: [{
                type: String,
                trim: true
            }],
            allergies: [{
                type: String,
                trim: true
            }],
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
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: DB_NAMES.students
    }
);

// Compound unique index
StudentSchema.index({ studentId: 1, school: 1 }, { unique: true });

const Student: Model<IStudent> = mongoose.model<IStudent>(DB_NAMES.students, StudentSchema);

export default Student;