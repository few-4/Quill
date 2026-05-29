import React, { useState, useMemo } from "react";
import { FileText, Plus, Search, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useDocuments, useDeleteDocument, useRenameDocument } from "../hooks/useDashboard";
import { useDebounce } from "../../../hooks/useDebounce";
import CreateDocumentModal from "../../../modal/CreateDocumentModal";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Loader from "../../../components/Loader";
import DocumentRow from "../components/DocumentRow";
import { timeAgo } from "../../../utils/timeAgo";

const EmptyState = ({ isFiltered, query, onClear }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center text-theme-txt-secondary/60 gap-2">
    <FileText className="w-8 h-8 opacity-40 text-brand-blue" />
    {isFiltered ? (
      <>
        <div>
          <span className="text-sm font-semibold text-theme-txt-primary/70">No results for &ldquo;{query}&rdquo;</span>
          <p className="text-xs mt-1">Try a different name or clear the search.</p>
        </div>
        <button onClick={onClear} className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer bg-transparent border-none">
          Clear search
        </button>
      </>
    ) : (
      <>
        <span className="text-sm font-semibold">No documents yet</span>
        <p className="text-xs">Create a document to get started!</p>
      </>
    )}
  </div>
);

const Documents = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [docToDelete, setDocToDelete] = useState(null);

  const { data: response = {}, isLoading } = useDocuments(workspaceId);
  const documents = response?.data || [];

  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument(workspaceId);
  const { mutate: renameDoc } = useRenameDocument(workspaceId);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const activeSearchQuery = searchQuery === "" ? "" : debouncedSearchQuery;

  const filtered = useMemo(
    () => documents.filter((d) => d.title?.toLowerCase().includes(activeSearchQuery.toLowerCase())),
    [documents, activeSearchQuery]
  );


  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    deleteDoc({ docId: docToDelete._id }, { onSuccess: () => setDocToDelete(null) });
  };

  if (isLoading) return <Loader text="Loading Documents..." />;

  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">Documents</h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Manage, organize, and write all your collaborative notes and documents.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none"
        >
          <Plus className="w-4 h-4" />
          <span>Create Document</span>
        </button>
      </header>

      <div className="bg-theme-card border border-theme-border rounded-2xl p-6 theme-transition w-full max-w-5xl flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-theme-border bg-theme-bg flex-1 max-w-md theme-transition focus-within:border-brand-blue/40 focus-within:ring-2 focus-within:ring-brand-blue/10">
            <Search className="w-4 h-4 text-theme-txt-secondary/50 shrink-0" />
            <input
              type="text"
              placeholder="Search documents…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-theme-txt-primary outline-none placeholder:text-theme-txt-secondary/40 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-theme-txt-secondary/40 hover:text-theme-txt-primary theme-transition cursor-pointer shrink-0 border-none bg-transparent p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {activeSearchQuery && (
            <span className="text-xs text-theme-txt-secondary/50 shrink-0">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="border border-theme-border/40 rounded-xl divide-y divide-theme-border/30 overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((doc) => (
              <DocumentRow
                key={doc._id}
                doc={doc}
                onClick={() => navigate(`/documents/${workspaceId}/document/${doc._id}`)}
                onDelete={(d) => setDocToDelete(d)}
                onRename={renameDoc}
                timeAgoText={timeAgo(doc.updatedAt)}
              />
            ))
          ) : (
            <EmptyState
              isFiltered={!!activeSearchQuery}
              query={activeSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          )}
        </div>
      </div>

      <CreateDocumentModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspaceId={workspaceId}
      />

      <ConfirmDialog
        isOpen={!!docToDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.title || "this document"}"? This action cannot be undone.`}
        confirmLabel="Delete Document"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocToDelete(null)}
      />
    </div>
  );
};

export default Documents;
