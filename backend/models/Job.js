import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyLogo: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time',
  },
  category: {
    type: String,
    enum: ['IT', 'Engineering', 'Marketing', 'Finance', 'Design', 'Sales', 'HR', 'Operations', 'Healthcare', 'Education', 'Other'],
    default: 'IT',
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
  },
  skills: [{
    type: String,
    trim: true,
  }],
  experience: {
    type: String,
    enum: ['fresher', '1-2 years', '3-5 years', '5-10 years', '10+ years'],
    default: 'fresher',
  },
  education: {
    type: String,
  },
  vacancies: {
    type: Number,
    default: 1,
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Text index for search
jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });
jobSchema.index({ location: 1, jobType: 1, category: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
