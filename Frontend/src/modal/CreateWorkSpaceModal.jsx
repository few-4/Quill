import React from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { X, Loader2, FolderPlus } from "lucide-react";
import { useWorkspace } from "../features/workspace/hooks/useWorkspace";

export default function CreateWorkSpaceModal({ isVisible, onClose }) {
    if (!isVisible) return null;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const { handleCreateWorkspace } = useWorkspace();
    const { mutate: createWorkspace, isPending, error: apiError } = handleCreateWorkspace()


    const onSubmit = (data) => {
        createWorkspace(data, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
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
                <div className="absolute bottom-[-20%] left-[-20%] w-[180px] h-[180px] bg-brand-pink/8 rounded-full blur-[45px] pointer-events-none" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-theme-txt-primary text-xl font-bold tracking-tight">Create Workspace</h2>
                        <p className="text-theme-txt-secondary text-xs mt-0.5">Start collaborating with your team in real-time</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute -top-1 -right-1 p-1.5 rounded-lg text-theme-txt-secondary/60 hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">

                    {/* Backend Error Alert */}
                    {apiError && (
                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed animate-in fade-in duration-200">
                            {apiError.response?.data?.message || apiError.message || "Failed to create workspace. Please try again."}
                        </div>
                    )}

                    {/* Workspace Name */}
                    <div className="space-y-1.5">
                        <label htmlFor="workspace-name" className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90">
                            Workspace Name
                        </label>
                        <input
                            id="workspace-name"
                            type="text"
                            className={`w-full px-4 py-2.5 rounded-xl bg-theme-bg border text-sm text-theme-txt-primary placeholder-theme-txt-secondary/40 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name
                                    ? "border-red-500/50 focus:ring-red-500/20"
                                    : "border-theme-border/70 focus:border-brand-blue focus:ring-brand-blue/20"
                                }`}
                            placeholder="e.g. Design System"
                            {...register("name", {
                                required: "Workspace name is required",
                                minLength: { value: 3, message: "Workspace name must be at least 3 characters" },
                                maxLength: { value: 30, message: "Workspace name cannot exceed 30 characters" },
                            })}
                        />
                        {errors.name && (
                            <span className="text-red-400 text-xs font-medium block pl-1 animate-in slide-in-from-top-1 duration-200">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    {/* Workspace Description */}
                    <div className="space-y-1.5">
                        <label htmlFor="workspace-desc" className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90">
                            Workspace Description
                        </label>
                        <textarea
                            id="workspace-desc"
                            rows={3}
                            className={`w-full px-4 py-2.5 rounded-xl bg-theme-bg border text-sm text-theme-txt-primary placeholder-theme-txt-secondary/40 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${errors.description
                                    ? "border-red-500/50 focus:ring-red-500/20"
                                    : "border-theme-border/70 focus:border-brand-blue focus:ring-brand-blue/20"
                                }`}
                            placeholder="Briefly describe what this workspace is for..."
                            {...register("description", {
                                required: "Workspace description is required",
                                minLength: { value: 10, message: "Workspace description must be at least 10 characters" },
                                maxLength: { value: 100, message: "Workspace description cannot exceed 100 characters" },
                            })}
                        />
                        {errors.description && (
                            <span className="text-red-400 text-xs font-medium block pl-1 animate-in slide-in-from-top-1 duration-200">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2.5 rounded-xl border border-theme-border/80 text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-border/30 transition-all font-semibold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-brand-blue to-purple-600 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <span>Create Workspace</span>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>,
        document.body
    );
}