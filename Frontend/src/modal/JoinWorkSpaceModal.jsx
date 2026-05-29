import React from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { useJoinWorkspace } from "../features/workspace/hooks/useWorkspace";
import ModalShell from "../components/ModalShell";
import { FormField, FormInput, ApiErrorAlert } from "../components/FormPrimitives";
import ModalActions from "../components/ModalActions";

export default function JoinWorkSpaceModal({ isVisible, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { inviteCode: "" },
  });

  const { mutate: joinWorkspace, isPending, error: apiError } = useJoinWorkspace();

  const onSubmit = (data) => {
    joinWorkspace(data, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  if (!isVisible) return null;

  return (
    <ModalShell onClose={onClose} accentColor="pink" icon={UserPlus} title="Join Workspace" subtitle="Enter an invite code to access shared documents">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        <ApiErrorAlert error={apiError} fallback="Failed to join workspace. Please verify the code." />

        <FormField label="Workspace Invite Code" htmlFor="invite-code" error={errors.inviteCode?.message}>
          <FormInput
            id="invite-code"
            type="text"
            hasError={!!errors.inviteCode}
            placeholder="e.g. A1B2C3D4E5"
            className="uppercase"
            {...register("inviteCode", {
              required: "Invite code is required",
              minLength: { value: 5, message: "Invite code must be at least 5 characters" },
              maxLength: { value: 20, message: "Invite code cannot exceed 20 characters" },
            })}
          />
        </FormField>

        <ModalActions
          onClose={onClose}
          isPending={isPending}
          submitLabel="Join Workspace"
          pendingLabel="Joining..."
          accentColor="pink"
        />
      </form>
    </ModalShell>
  );
}
