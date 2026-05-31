import React from 'react';
import { NavLink } from 'react-router';
import { Palette, FileText } from 'lucide-react';

const NavDocumentDropdown = ({ workspaceId, documentId, activeDocument, allDocuments = [] }) => {
  return (
    <div className="mt-1 mb-1.5 ml-3 flex flex-col gap-0.5">
      {}
      <NavLink
        to={`/documents/${workspaceId}/document/${documentId}`}
        className={({ isActive }) =>
          `flex items-center gap-2.5 pl-3 pr-2.5 py-2 rounded-lg text-xs theme-transition duration-200 relative no-underline group ${
            isActive
              ? "bg-brand-blue/10 text-brand-blue font-semibold"
              : "text-theme-txt-secondary font-medium hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {}
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full transition-all duration-200 ${
              isActive ? "bg-brand-blue" : "bg-transparent group-hover:bg-theme-txt-secondary/20"
            }`} />

            {}
            {activeDocument?.type === "visual" ? (
              <Palette className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-brand-blue" : "text-theme-txt-secondary/50 group-hover:text-theme-txt-primary"}`} />
            ) : (
              <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-brand-blue" : "text-theme-txt-secondary/50 group-hover:text-theme-txt-primary"}`} />
            )}

            {}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate leading-tight" title={activeDocument?.title}>
                {activeDocument?.title || "Untitled Document"}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5 ${
                isActive ? "text-brand-blue/70" : "text-theme-txt-secondary/30"
              }`}>
                {activeDocument?.type === "visual" ? "Canvas" : "Document"}
              </span>
            </div>

            {}
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
            )}
          </>
        )}
      </NavLink>

      {}
      {allDocuments
        .filter((d) => d._id !== documentId)
        .slice(0, 3)
        .map((doc) => (
          <NavLink
            key={doc._id}
            to={`/documents/${workspaceId}/document/${doc._id}`}
            className="flex items-center gap-2.5 pl-3 pr-2.5 py-1.5 rounded-lg text-xs font-medium text-theme-txt-secondary/60 hover:text-theme-txt-primary hover:bg-theme-btn-sec-hover theme-transition duration-200 no-underline group relative"
          >
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-full bg-transparent group-hover:bg-theme-txt-secondary/20 transition-all duration-200" />
            {doc.type === "visual" ? (
              <Palette className="w-3 h-3 shrink-0 text-brand-pink/60 group-hover:text-brand-pink" />
            ) : (
              <FileText className="w-3 h-3 shrink-0 text-theme-txt-secondary/40 group-hover:text-theme-txt-primary" />
            )}
            <span className="truncate" title={doc.title}>
              {doc.title || "Untitled Document"}
            </span>
          </NavLink>
        ))}

      {}
      {allDocuments.length > 0 && (
        <NavLink
          to={`/documents/${workspaceId}`}
          className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-theme-txt-secondary/40 hover:text-brand-blue hover:bg-brand-blue/5 theme-transition duration-200 no-underline"
        >
          <span>All documents →</span>
        </NavLink>
      )}
    </div>
  );
};

export default NavDocumentDropdown;
