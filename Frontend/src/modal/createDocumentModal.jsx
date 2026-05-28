import React from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { X, FileText, Layout, FolderPlus } from "lucide-react";
import { useParams } from "react-router";

export default function CreateDocumentModal({ isVisible = true, onClose }) {
  if (!isVisible) return null;

  const {workspaceId} = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      type: "text",
      workspaceId,
    },
  });


  const selectedType = watch("type");

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    if (onClose) onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all duration-300 animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-theme-card border border-theme-border/80 rounded-2xl p-6 shadow-2xl flex flex-col items-stretch overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Floating background auroral glow */}
        <div className="absolute top-[-20%] right-[-20%] w-[180px] h-[180px] bg-brand-blue/8 rounded-full blur-[45px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-theme-txt-primary text-xl font-bold tracking-tight">Create Document</h2>
            <p className="text-theme-txt-secondary text-xs mt-0.5">Add a new document to your collaborative workspace</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-1 -right-1 p-1.5 rounded-lg text-theme-txt-secondary/60 hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          
          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label htmlFor="doc-title" className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90">
              Title
            </label>
            <input
              id="doc-title"
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl bg-theme-bg border text-sm text-theme-txt-primary placeholder-theme-txt-secondary/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.title
                  ? "border-red-500/50 focus:ring-red-500/20"
                  : "border-theme-border/70 focus:border-brand-blue focus:ring-brand-blue/20"
              }`}
              placeholder="e.g. Q3 Roadmap"
              {...register("title", {
                required: "Document title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" },
                maxLength: {value: 30, message: "Title must be less than 30 characters"}
              })}
            />
            {errors.title && (
              <span className="text-red-400 text-xs font-medium block pl-1 animate-in slide-in-from-top-1 duration-200">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Document Type Choices */}
          <div className="space-y-2">
            <label className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90 block">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Option 1: Text Document */}
              <div
                onClick={() => setValue("type", "text")}
                className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 ${
                  selectedType === "text"
                    ? "border-brand-blue bg-brand-blue/5"
                    : "border-theme-border/75 hover:border-brand-blue/50 bg-theme-bg/50 hover:bg-theme-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  selectedType === "text"
                    ? "bg-brand-blue/15 text-brand-blue"
                    : "bg-theme-border text-theme-txt-secondary group-hover:text-brand-blue group-hover:bg-brand-blue/10"
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-theme-txt-primary">Text Document</div>
                  <p className="text-[10px] text-theme-txt-secondary/70 leading-relaxed mt-1">Rich formatting & layout tools</p>
                </div>
              </div>

              {/* Option 2: Visual Document */}
              <div
                onClick={() => setValue("type", "visual")}
                className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 ${
                  selectedType === "visual"
                    ? "border-brand-pink bg-brand-pink/5"
                    : "border-theme-border/75 hover:border-brand-pink/50 bg-theme-bg/50 hover:bg-theme-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  selectedType === "visual"
                    ? "bg-brand-pink/15 text-brand-pink"
                    : "bg-theme-border text-theme-txt-secondary group-hover:text-brand-pink group-hover:bg-brand-pink/10"
                }`}>
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-theme-txt-primary">Visual Document</div>
                  <p className="text-[10px] text-theme-txt-secondary/70 leading-relaxed mt-1">Whiteboards & infinite canvases</p>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-theme-border/80 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all font-semibold text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Create Document
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}