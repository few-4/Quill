import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FileText, Palette, Plus } from "lucide-react";
import { useDocuments } from "../hooks/useDashboard";
import CreateDocumentModal from "../../../modal/CreateDocumentModal";
import StatCard from "../components/StatCard";
import { timeAgo } from "../../../utils/timeAgo";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  const { data: response = {}, isLoading } = useDocuments(workspaceId);
  const documents = response?.data || [];

  const textDocs = documents.filter((d) => d.type === "text");
  const visualDocs = documents.filter((d) => d.type === "visual");
  const recentDoc = documents[0] ?? null;
  const recentVisual = visualDocs[0] ?? null;

  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10">
      <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1">
            Welcome back! Here is a summary of your workspace activities and documents.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-theme-btn-cta-bg text-theme-btn-cta-text text-sm font-semibold tracking-tight hover:opacity-90 active:scale-[0.98] theme-transition shadow-sm cursor-pointer border-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <StatCard
          title="Text Documents"
          value={textDocs.length}
          isLoading={isLoading}
          Icon={FileText}
          iconColorClass="bg-brand-blue/10 text-brand-blue"
          description="Rich-text documentation, meeting minutes, and workspace wikis."
          onClick={() => navigate(`/documents/${workspaceId}`)}
        />
        <StatCard
          title="Visual Canvases"
          value={visualDocs.length}
          isLoading={isLoading}
          Icon={Palette}
          iconColorClass="bg-brand-pink/10 text-brand-pink"
          description="Visual whiteboards, interactive diagrams, and user flows."
          onClick={() => navigate(`/documents/${workspaceId}`)}
        />
        <StatCard
          title="Recent Document"
          value={recentDoc?.title}
          isLoading={isLoading}
          Icon={FileText}
          iconColorClass="bg-brand-blue/10 text-brand-blue"
          isRecent
          hasItem={!!recentDoc}
          emptyText="No documents yet"
          footerText={recentDoc ? `Edited ${timeAgo(recentDoc.updatedAt)}` : "No activity yet"}
          actionText="Open File"
          onClick={() => recentDoc && navigate(`/documents/${workspaceId}/document/${recentDoc._id}`)}
        />
        <StatCard
          title="Recent Visual Canvas"
          value={recentVisual?.title}
          isLoading={isLoading}
          Icon={Palette}
          iconColorClass="bg-brand-pink/10 text-brand-pink"
          isRecent
          hasItem={!!recentVisual}
          emptyText="No visual canvases yet"
          footerText={recentVisual ? `Edited ${timeAgo(recentVisual.updatedAt)}` : "No activity yet"}
          actionText="Open Canvas"
          onClick={() => recentVisual && navigate(`/documents/${workspaceId}/document/${recentVisual._id}`)}
        />
      </div>

      <CreateDocumentModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default DashboardHome;
