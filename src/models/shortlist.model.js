import mongoose from 'mongoose';

const shortlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    shortlistedUserId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

shortlistSchema.index({ userId: 1, shortlistedUserId: 1 }, { unique: true });

export default mongoose.model('Shortlist', shortlistSchema);
