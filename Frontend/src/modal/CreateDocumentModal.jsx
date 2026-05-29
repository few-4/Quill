import React from "react";
import { useForm } from "react-hook-form";
import { FilePlus, FileText, Image } from "lucide-react";
import { useCreateDocument } from "../features/dashboard/hooks/useDashboard";
import ModalShell from "../components/ModalShell";
import { FormField, FormInput, ApiErrorAlert } from "../components/FormPrimitives";
import ModalActions from "../components/ModalActions";

const DOC_TYPES = [
  {
    value: "text",
    label: "Document Editor",
    Icon: FileText,
    activeClass: "border-brand-blue bg-brand-blue/5 text-brand-blue font-bold shadow-[0_4px_12px_rgba(59,130,246,0.15)]",
  },
  {
    value: "visual",
    label: "Whiteboard Canvas",
    Icon: Image,
    activeClass: "border-brand-pink bg-brand-pink/5 text-brand-pink font-bold shadow-[0_4px_12px_rgba(236,72,153,0.15)]",
  },
];

const TypeCard = ({ option, isSelected, onSelect }) => {
  const { Icon, label, value, activeClass } = option;
  return (
    <div
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-theme-bg/40 ${
        isSelected ? activeClass : "border-theme-border/70 text-theme-txt-secondary"
      }`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default function CreateDocumentModal({ isVisible, onClose, workspaceId }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    defaultValues: { title: "", type: "text" },
  });

  const selectedType = watch("type");
  const { mutate: createDocument, isPending, error: apiError } = useCreateDocument();

  const onSubmit = (data) => {
    createDocument({ ...data, workspaceId }, {
      onSuccess: () => { reset(); onClose(); },
    });
  };

  if (!isVisible) return null;

  return (
    <ModalShell onClose={onClose} icon={FilePlus} title="Create Document" subtitle="Start mapping wireframes or writing collaborative notes">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
        <ApiErrorAlert error={apiError} fallback="Failed to create document. Please try again." />

        <FormField label="Document Title" htmlFor="document-title" error={errors.title?.message}>
          <FormInput
            id="document-title"
            type="text"
            hasError={!!errors.title}
            placeholder="e.g. Q3 Launch Strategy"
            {...register("title", {
              required: "Document title is required",
              minLength: { value: 3, message: "Document title must be at least 3 characters" },
              maxLength: { value: 50, message: "Document title cannot exceed 50 characters" },
            })}
          />
        </FormField>

        <div className="space-y-2">
          <span className="text-theme-txt-primary text-xs font-semibold uppercase tracking-wider opacity-90">
            Document Type
          </span>
          <div className="grid grid-cols-2 gap-3">
            {DOC_TYPES.map((option) => (
              <TypeCard
                key={option.value}
                option={option}
                isSelected={selectedType === option.value}
                onSelect={(val) => setValue("type", val)}
              />
            ))}
          </div>
        </div>

        <ModalActions
          onClose={onClose}
          isPending={isPending}
          submitLabel="Create Document"
          pendingLabel="Creating..."
        />
      </form>
    </ModalShell>
  );
}