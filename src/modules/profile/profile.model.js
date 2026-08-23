import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    // =========================
    // Profile Identification
    // =========================

    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // =========================
    // Basic Information
    // =========================

    profileFor: {
      type: String,
      enum: ['self', 'son', 'daughter', 'brother', 'sister', 'relative', 'friend'],
      required: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
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
      enum: ['never_married', 'divorced', 'widowed', 'separated'],
      default: null,
    },

    motherTongue: {
      type: String,
      trim: true,
      default: null,
    },

    // =========================
    // Education & Career
    // =========================

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
      type: Number,
      min: 0,
      default: null,
    },

    // =========================
    // Family Information
    // =========================

    familyType: {
      type: String,
      enum: ['joint', 'nuclear', 'extended'],
      default: null,
    },

    familyStatus: {
      type: String,
      enum: ['middle_class', 'upper_middle_class', 'rich', 'affluent'],
      default: null,
    },

    // =========================
    // Location
    // =========================

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

    // =========================
    // Partner Preference
    // =========================

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

    // =========================
    // Profile Content
    // =========================

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

    // =========================
    // Profile Status
    // =========================

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
