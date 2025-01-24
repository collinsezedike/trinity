import mongoose from "mongoose";

export type UserType = {
	address: string;
	username: string;
};

const UserSchema = new mongoose.Schema<UserType>(
	{
		address: {
			type: String,
			required: [true, "Please provide a user wallet address"],
		},

		username: {
			type: String,
			required: [true, "Please provide a username"],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
