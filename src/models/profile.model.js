import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    profileFor: {
      type: String,
      enum: ['self', 'son', 'daughter', 'brother', 'sister', 'relative', 'friend'],
      required: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    religion: {
      type: String,
      required: true,
      trim: true,
    },

    community: {
      type: String,
      required: true,
      trim: true,
    },

    height: {
      type: Number,
      min: 50,
      max: 250,
      default: null,
    },

    color: {
      type: String,
      trim: true,
      default: null,
    },

    maritalStatus: {
      type: String,
      enum: ['Never Married', 'Divorced', 'Widowed', 'Separated'],
      default: null,
    },

    motherTongue: {
      type: String,
      trim: true,
      default: null,
    },

    education: {
      type: String,
      trim: true,
      default: null,
    },

    occupation: {
      type: String,
      trim: true,
      default: null,
    },

    annualIncome: {
      type: String,
      enum: [
        'Below ₹5 Lakh',
        '₹5 - ₹10 Lakh',
        '₹10 - ₹20 Lakh',
        '₹20 - ₹30 Lakh',
        '₹30 - ₹50 Lakh',
        'Above ₹50 Lakh',
      ],
      default: null,
    },

    familyType: {
      type: String,
      enum: ['Joint Family', 'Nuclear Family', 'Extended Family'],
      default: null,
    },

    familyStatus: {
      type: String,
      enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'],
      default: null,
    },

    location: {
      country: {
        type: String,
        trim: true,
        default: null,
      },

      state: {
        type: String,
        trim: true,
        default: null,
      },

      city: {
        type: String,
        trim: true,
        default: null,
      },
    },

    partnerPreference: {
      minAge: {
        type: Number,
        min: 18,
        default: null,
      },

      maxAge: {
        type: Number,
        max: 100,
        default: null,
      },

      religion: {
        type: [String],
        default: [],
      },

      community: {
        type: [String],
        default: [],
      },

      education: {
        type: [String],
        default: [],
      },

      occupation: {
        type: [String],
        default: [],
      },
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    aboutMe: {
      type: String,
      maxlength: 2000,
      trim: true,
      default: null,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'hidden', 'under_review', 'rejected'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Profile', profileSchema);
