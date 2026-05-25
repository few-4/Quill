import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private"
    },

    inviteCode: {
        type: String
    }

}, { timestamps: true });

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;