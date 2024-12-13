import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import DB_NAMES from '../../config/db-names';
import ENUMS from '../../config/enums';



export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    profileImage?: string;
    isActive: boolean;
    isBlocked: boolean;
    lastLogin?: Date;
    isDeleted?: boolean;
    school?: mongoose.Types.ObjectId;
    staff?: mongoose.Types.ObjectId;
    student?: mongoose.Types.ObjectId;
    teacher?: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;

    // Method to compare password
    comparePassword (candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false
        },
        role: {
            type: String,
            enum: ENUMS.role,
            default: "ROLE_USER",
            required: [true, 'User role is required']
        },
        profileImage: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.school
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.staff
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.students
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.teachers
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: DB_NAMES.parents
        },
        isBlocked: {
            type: Boolean,
            default: false
        }


    },
    {
        timestamps: true,
        collection: DB_NAMES.users
    }
);

UserSchema.index({ email: 1, school: 1 }, { unique: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password along with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        return next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.findByEmail = async function (email: string) {
    return this.findOne({ email: email.toLowerCase() });
};


const User: Model<IUser> = mongoose.model<IUser>(DB_NAMES.users, UserSchema);

export default User;