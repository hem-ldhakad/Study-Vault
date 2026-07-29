const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a chapter name'],
      trim: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Chapter must belong to a subject'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chapter', chapterSchema);
