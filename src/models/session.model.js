import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    userAgent: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expireAfterSeconds: 0,
      },
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export default mongoose.model('Sessions', sessionSchema);
