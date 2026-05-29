import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check, Copy, Building2, Link2, AlertTriangle,
  ChevronRight, Loader2, Trash2
} from "lucide-react";
import { fetchCurrentWorkspace, updateWorkspace as updateWorkspaceApi } from "../../workspace/services/workspace.api";
import { useDeleteWorkspace, useLeaveWorkspace } from "../../workspace/hooks/useWorkspace";
import { setWorkspace } from "../dashboard.slice";
import ConfirmDialog from "../../../components/ConfirmDialog";

const NAV_SECTIONS = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "invite", label: "Invite & Access", icon: Link2 },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
];

const SectionLabel = ({ icon: Icon, title, description }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2.5 mb-1.5">
      <Icon size={16} className="text-theme-txt-secondary/70 shrink-0" />
      <h2 className="text-base font-bold text-theme-txt-primary">{title}</h2>
    </div>
    <p className="text-sm text-theme-txt-secondary/60 leading-relaxed">{description}</p>
    <div className="mt-5 border-t border-theme-border/60" />
  </div>
);

const InputField = ({ label, hint, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-theme-txt-secondary uppercase tracking-wider">{label}</label>
    <input
      className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-bg text-theme-txt-primary text-sm outline-none focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 theme-transition font-sans placeholder:text-theme-txt-secondary/40"
      {...props}
    />
    {hint && <p className="text-xs text-theme-txt-secondary/50 mt-0.5">{hint}</p>}
  </div>
);

const Settings = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state) => state.auth.user);

  const [activeSection, setActiveSection] = useState("workspace");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [leaveError, setLeaveError] = useState("");

  const { data: workspaceData, isLoading } = useQuery({
    queryKey: ["currentWorkspace", workspaceId],
    queryFn: async () => {
      const res = await fetchCurrentWorkspace(workspaceId);
      return res.data.workspace;
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (workspaceData) {
      setName(workspaceData.name || "");
      setDescription(workspaceData.description || "");
    }
  }, [workspaceData]);

  const { mutate: saveWorkspace, isPending } = useMutation({
    mutationFn: updateWorkspaceApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentWorkspace", workspaceId], data.data);
      dispatch(setWorkspace(data.data));
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2500);
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    },
  });

  const handleSave = () => {
    if (!name.trim() || (!isDirty)) return;
    saveWorkspace({ workspaceId, name: name.trim(), description: description.trim() });
  };

  const handleCopyInviteCode = () => {
    if (!workspaceData?.inviteCode) return;
    navigator.clipboard.writeText(workspaceData.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDirty =
    name.trim() !== (workspaceData?.name || "") ||
    description.trim() !== (workspaceData?.description || "");

  const ownerId = workspaceData?.owner?._id || workspaceData?.owner;
  const isOwner = !!(ownerId && currentUser && (ownerId === currentUser.id || ownerId === currentUser._id));

  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();
  const { mutate: leaveWorkspaceMutation, isPending: isLeaving } = useLeaveWorkspace();

  const handleDeleteWorkspace = () => {
    deleteWorkspace(
      { workspaceId },
      {
        onError: (err) => {
          const msg = err.response?.data?.message || "Failed to delete workspace. Only the owner has this permission.";
          setDeleteError(msg);
        },
      }
    );
  };

  const handleLeaveWorkspace = () => {
    leaveWorkspaceMutation(
      { workspaceId },
      {
        onError: (err) => {
          const msg = err.response?.data?.message || "Failed to leave workspace.";
          setLeaveError(msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          <span className="text-sm text-theme-txt-secondary">Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">

      {/* ── Left sidebar nav ── */}
      <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-theme-border bg-theme-card flex flex-row md:flex-col pt-4 md:pt-8 pb-3 md:pb-4 theme-transition overflow-x-auto select-none">
        <div className="hidden md:block px-5 mb-6 shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-theme-txt-secondary/40 uppercase mb-0.5">Workspace</p>
          <h1 className="text-xl font-extrabold tracking-tight text-theme-txt-primary">Settings</h1>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            <span className="text-xs text-theme-txt-secondary/60 truncate">{workspaceData?.name}</span>
          </div>
        </div>

        <nav className="flex flex-row md:flex-col px-3 gap-1.5 md:gap-0.5 min-w-max md:min-w-0">
          {NAV_SECTIONS.map(({ id, label, icon: Icon, danger }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-max md:w-full text-left theme-transition cursor-pointer border-none ${
                activeSection === id
                  ? danger
                    ? "bg-red-500/10 text-red-400"
                    : "bg-theme-btn-sec-hover text-theme-txt-primary"
                  : danger
                    ? "text-red-400/60 hover:bg-red-500/8 hover:text-red-400"
                    : "text-theme-txt-secondary hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover"
              }`}
            >
              {activeSection === id && !danger && (
                <span className="absolute left-3 w-0.5 h-4 rounded-full bg-brand-blue hidden md:block" />
              )}
              <Icon size={15} className="shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 theme-transition">
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-8">

          {activeSection === "workspace" && (
            <section>
              <SectionLabel
                icon={Building2}
                title="Workspace Identity"
                description="Update your workspace name and description. Changes are visible to all members immediately."
              />

              {!isOwner && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold theme-transition mb-6">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>Only workspace owner can change workspace name and description.</span>
                </div>
              )}

              <div className="flex flex-col gap-5">
                <InputField
                  label="Workspace Name"
                  type="text"
                  placeholder="e.g. Quill HQ"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isOwner}
                  hint="3–30 characters. Shown everywhere your workspace is referenced."
                />
                <InputField
                  label="Description"
                  type="text"
                  placeholder="Describe what this workspace is for…"
                  maxLength={100}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isOwner}
                  hint="10–100 characters. Helps teammates understand the workspace purpose."
                />

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={isPending || !isDirty || !name.trim() || !isOwner}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold hover:opacity-90 active:scale-[0.98] theme-transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving…
                      </>
                    ) : "Save Changes"}
                  </button>

                  {saveStatus === "success" && (
                    <div className="flex items-center gap-1.5 text-brand-green text-sm font-medium animate-in fade-in">
                      <Check size={14} /> Saved
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-1.5 text-red-400 text-sm font-medium animate-in fade-in">
                      Failed to save
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeSection === "invite" && (
            <section>
              <SectionLabel
                icon={Link2}
                title="Invite & Access"
                description="Share the invite code below to let others join your workspace. Anyone with this code can join as a member."
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border border-theme-border bg-theme-metric font-mono text-sm text-theme-txt-primary tracking-widest overflow-hidden theme-transition">
                    <span className="select-all truncate">{workspaceData?.inviteCode || "—"}</span>
                  </div>
                  <button
                    onClick={handleCopyInviteCode}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-metric text-theme-txt-primary text-sm font-semibold theme-transition active:scale-[0.97] cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-brand-green" />
                        <span className="text-brand-green">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-theme-txt-secondary/50 leading-relaxed">
                  Invite codes are permanent. Share them only with people you trust — anyone who has this code can join the workspace.
                </p>
              </div>
            </section>
          )}

          {activeSection === "danger" && (
            <section className="flex flex-col gap-4">
              <SectionLabel
                icon={AlertTriangle}
                title="Danger Zone"
                description="Actions in this section are destructive and may not be reversible. Proceed with caution."
              />

              <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/25 bg-red-500/5 theme-transition">
                <div>
                  <p className="text-sm font-semibold text-theme-txt-primary">Leave Workspace</p>
                  <p className="text-xs text-theme-txt-secondary/60 mt-0.5 leading-relaxed">
                    You will lose access to all documents and conversations in this workspace. Workspace owners cannot leave.
                  </p>
                </div>
                <button
                  disabled={isOwner || isLeaving}
                  onClick={() => setShowLeaveConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold theme-transition hover:bg-red-500/10 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ml-6"
                >
                  Leave
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-xl border border-red-500/30 bg-red-500/8 theme-transition">
                <div>
                  <p className="text-sm font-semibold text-red-400">Delete Workspace</p>
                  <p className="text-xs text-theme-txt-secondary/60 mt-0.5 leading-relaxed">
                    Permanently delete this workspace and all its documents. Only the owner can do this.
                  </p>
                </div>
                <button
                  disabled={!isOwner}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 theme-transition active:scale-[0.97] cursor-pointer shrink-0 ml-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </section>
          )}

        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Workspace"
        message={`Are you sure you want to permanently delete "${workspaceData?.name}"? All documents and messages will be deleted. This cannot be undone.`}
        confirmLabel="Delete Workspace"
        isPending={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteWorkspace}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteError("");
        }}
      />

      <ConfirmDialog
        isOpen={showLeaveConfirm}
        title="Leave Workspace"
        message={`Are you sure you want to leave "${workspaceData?.name}"? You will lose access to all documents and conversations in this workspace.`}
        confirmLabel="Leave Workspace"
        isPending={isLeaving}
        error={leaveError}
        onConfirm={handleLeaveWorkspace}
        onCancel={() => {
          setShowLeaveConfirm(false);
          setLeaveError("");
        }}
      />
    </div>
  );
};

export default Settings;