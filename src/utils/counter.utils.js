import Counter from '../models/counter.model.js';

export const getNextUserSequence = async (session) => {
  const counter = await Counter.findOneAndUpdate(
    { key: 'user' },
    { $inc: { sequence: 1 } },
    {
      new: true,
      upsert: true,
      session,
    }
  );

  if (!counter) {
    throw new Error('Unable to generate user sequence');
  }

  return counter.sequence;
};
