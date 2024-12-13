import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';

export interface IParent extends Document {
    userId: mongoose.Types.ObjectId;
    school: mongoose.Types.ObjectId;
    parentId: string;
    children: mongoose.Types.ObjectId[];
    occupation?: string;
    annualIncome?: number;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    communicationPreferences: {
        email: boolean;
        sms: boolean;
        phoneCall: boolean;
    };
    isActive: boolean;
}

const ParentSchema: Schema = new Schema<IParent>(
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
        parentId: {
            type: String,
            required: [true, 'Parent ID is required'],
            unique: true,
            trim: true
        },
        children: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.students
        }],
        occupation: {
            type: String,
            trim: true
        },
        annualIncome: {
            type: Number,
            min: [0, 'Annual income cannot be negative']
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
        },
        address: {
            street: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            postalCode: {
                type: String,
                trim: true
            },
            country: {
                type: String,
                trim: true
            }
        },
        communicationPreferences: {
            email: {
                type: Boolean,
                default: true
            },
            sms: {
                type: Boolean,
                default: true
            },
            phoneCall: {
                type: Boolean,
                default: false
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        collection: DB_NAMES.parents
    }
);

// Compound unique index
ParentSchema.index({ parentId: 1, school: 1 }, { unique: true });

const Parent: Model<IParent> = mongoose.model<IParent>(DB_NAMES.parents, ParentSchema);

export default Parent;