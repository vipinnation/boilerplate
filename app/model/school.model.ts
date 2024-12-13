import mongoose, { Schema, Document, Model } from 'mongoose';
import DB_NAMES from '../../config/db-names';

export interface ISchool extends Document {
    name: string;
    address: string;
    contactInfo: {
        phone: string;
        email: string;
    };
    establishedYear: number;
    branches: mongoose.Types.ObjectId[];
}

const SchoolSchema: Schema = new Schema<ISchool>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        contactInfo: {
            phone: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                match: [/.+\@.+\..+/, 'Please fill a valid email address'],
            },
        },
        establishedYear: {
            type: Number,
            required: true,
        },
        branches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: DB_NAMES.branchs,
            },
        ],
    },
    { timestamps: true }
);

const School: Model<ISchool> = mongoose.model<ISchool>(DB_NAMES.school, SchoolSchema);
export default School;
