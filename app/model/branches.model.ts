import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';

export interface IBranch extends Document {
    name: string;
    address: string;
    school: mongoose.Types.ObjectId;
    contactInfo: {
        phone: string;
        email: string;
    };
    status: 'active' | 'inactive';
    maxCapacity?: number;
    operatingHours?: {
        openTime: string;
        closeTime: string;
    };
    facilities?: string[];
}

const BranchSchema: Schema = new Schema<IBranch>(
    {
        name: {
            type: String,
            required: [true, 'Branch name is required'],
            trim: true,
            minlength: [2, 'Branch name must be at least 2 characters long'],
            maxlength: [100, 'Branch name cannot exceed 100 characters'],
        },
        address: {
            type: String,
            required: [true, 'Branch address is required'],
            trim: true,
            minlength: [5, 'Address must be at least 5 characters long'],
            maxlength: [200, 'Address cannot exceed 200 characters'],
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.school,
            required: [true, 'School reference is required'],
        },
        contactInfo: {
            phone: {
                type: String,
                required: [true, 'Contact phone number is required'],
                match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'],
            },
            email: {
                type: String,
                required: [true, 'Contact email is required'],
                lowercase: true,
                trim: true,
                match: [/.+\@.+\..+/, 'Please fill a valid email address'],
                unique: true,
            },
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        maxCapacity: {
            type: Number,
            min: [0, 'Capacity cannot be negative'],
        },
        operatingHours: {
            openTime: {
                type: String,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:MM (24-hour)'],
            },
            closeTime: {
                type: String,
                match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:MM (24-hour)'],
            },
        },
        facilities: [{
            type: String,
            trim: true,
        }],
    },
    {
        timestamps: true,
        collection: DB_NAMES.branchs,
    }
);

BranchSchema.index({ name: 1, school: 1 }, { unique: true });

BranchSchema.pre('validate', function (next) {
    if (this.operatingHours && this.operatingHours.openTime && this.operatingHours.closeTime) {
        const openTime = this.operatingHours.openTime;
        const closeTime = this.operatingHours.closeTime;

        const [openHours, openMinutes] = openTime.split(':').map(Number);
        const [closeHours, closeMinutes] = closeTime.split(':').map(Number);

        const openTotal = openHours * 60 + openMinutes;
        const closeTotal = closeHours * 60 + closeMinutes;

        if (closeTotal <= openTotal) {
            this.invalidate('operatingHours', 'Close time must be after open time');
        }
    }
    next();
});

const Branch: Model<IBranch> = mongoose.model<IBranch>(DB_NAMES.branchs, BranchSchema);
export default Branch;