import React from "react";
import { useForm } from "react-hook-form";
import { FolderPlus } from "lucide-react";
import { useCreateWorkspace } from "../features/workspace/hooks/useWorkspace";
import ModalShell from "../components/ModalShell";
import { FormField, FormInput, FormTextarea, ApiErrorAlert } from "../components/FormPrimitives";
import ModalActions from "../components/ModalActions";

export default function CreateWorkSpaceModal({ isVisible, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { name: "", description: "" },
  });

  const { mutate: createWorkspace, isPending, error: apiError } = useCreateWorkspace();

  const onSubmit = (data) => {
    createWorkspace(data, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  if (!isVisible) return null;

  return (
    <ModalShell onClose={onClose} icon={FolderPlus} title="Create Workspace" subtitle="Start collaborating with your team in real-time">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        <ApiErrorAlert error={apiError} fallback="Failed to create workspace. Please try again." />

        <FormField label="Workspace Name" htmlFor="workspace-name" error={errors.name?.message}>
          <FormInput
            id="workspace-name"
            type="text"
            hasError={!!errors.name}
            placeholder="e.g. Design System"
            {...register("name", {
              required: "Workspace name is required",
              minLength: { value: 3, message: "Workspace name must be at least 3 characters" },
              maxLength: { value: 30, message: "Workspace name cannot exceed 30 characters" },
            })}
          />
        </FormField>

        <FormField label="Workspace Description" htmlFor="workspace-desc" error={errors.description?.message}>
          <FormTextarea
            id="workspace-desc"
            rows={3}
            hasError={!!errors.description}
            placeholder="Briefly describe what this workspace is for..."
            {...register("description", {
              required: "Workspace description is required",
              minLength: { value: 10, message: "Workspace description must be at least 10 characters" },
              maxLength: { value: 100, message: "Workspace description cannot exceed 100 characters" },
            })}
          />
        </FormField>

        <ModalActions
          onClose={onClose}
          isPending={isPending}
          submitLabel="Create Workspace"
          pendingLabel="Creating..."
        />
      </form>
    </ModalShell>
  );
}