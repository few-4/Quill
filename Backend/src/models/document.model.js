import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Document",
    },
    type: {
      type: String,
      enum: ["text", "visual"],
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true, 
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For REST text document (TipTap JSON AST)
    textContent: {
      type: mongoose.Schema.Types.Mixed, 
      default: null,
    },
    // For REST visual drawing canvas (Excalidraw JSON elements)
    visualContent: {
      type: mongoose.Schema.Types.Mixed, 
      default: null,
    },
    // For Yjs binary state storage (Crucial for the next phase)
    yDocState: {
      type: Buffer,
      default: null,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ workspaceId: 1, updatedAt: -1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;