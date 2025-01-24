import mongoose, { Types } from "mongoose";

export type CommunityType = {
	name: string;
	description: string;
	manager: Types.ObjectId;
};

const CommunitySchema = new mongoose.Schema<CommunityType>(
	{
		name: {
			type: String,
			required: [true, "Please provide a community name"],
		},

		description: {
			type: String,
			required: [true, "Please provide a community description"],
		},

		manager: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user id as the community manager"],
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Community", CommunitySchema);
