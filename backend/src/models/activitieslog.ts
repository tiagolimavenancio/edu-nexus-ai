import mongoose, { Schema, type Document } from "mongoose";

export interface IActivityLog extends Document {
  user: string;
  action: string;
  details?: string;
  createdAt: Date;
}

const activitiesLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    action: { type: String, required: true },
    details: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IActivityLog>("ActivitiesLog", activitiesLogSchema);
