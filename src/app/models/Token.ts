import mongoose, { Types } from "mongoose";

export type TokenType = {
	name: string;
	symbol: string;
	description: string;
	image: string;
	mint: string;
	authority: Types.ObjectId;
	community: Types.ObjectId;
};

const TokenSchema = new mongoose.Schema<TokenType>(
	{
		name: {
			type: String,
			required: [true, "Please provide a token name"],
		},

		description: {
			type: String,
			required: [true, "Please provide a token description"],
		},

		symbol: {
			type: String,
			required: [true, "Please provide a token symbol/ticker"],
		},

		image: {
			type: String,
			required: [true, "Please provide a token image"],
		},

		mint: {
			type: String,
			required: [true, "Please provide a token mint"],
		},

		authority: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user id as the token manager"],
		},

		community: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Community",
			required: [
				true,
				"Please provide community id as the token community",
			],
		},
	},
	{ timestamps: true }
);

const Token = mongoose.model("Token", TokenSchema);

export default Token;
