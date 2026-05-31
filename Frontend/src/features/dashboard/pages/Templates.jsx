import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Sparkles, CalendarDays, Rocket, BarChart2,
  Code2, Bug, Layers, ArrowRight, Loader2
} from "lucide-react";
import { useCreateDocument } from "../hooks/useDashboard";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "../data/templates";

const ICON_MAP = {
  CalendarDays, Rocket, BarChart2, Code2, Bug, Layers,
};

const COLOR_MAP = {
  blue:   { bg: "bg-brand-blue/10",   text: "text-brand-blue",   badge: "bg-brand-blue/10 text-brand-blue",   hover: "hover:border-brand-blue/40" },
  pink:   { bg: "bg-brand-pink/10",   text: "text-brand-pink",   badge: "bg-brand-pink/10 text-brand-pink",   hover: "hover:border-brand-pink/40" },
  green:  { bg: "bg-brand-green/10",  text: "text-brand-green",  badge: "bg-brand-green/10 text-brand-green",  hover: "hover:border-brand-green/40" },
  purple: { bg: "bg-purple-500/10",   text: "text-purple-400",   badge: "bg-purple-500/10 text-purple-400",   hover: "hover:border-purple-400/40" },
  red:    { bg: "bg-red-500/10",      text: "text-red-400",      badge: "bg-red-500/10 text-red-400",         hover: "hover:border-red-400/40" },
  orange: { bg: "bg-orange-500/10",   text: "text-orange-400",   badge: "bg-orange-500/10 text-orange-400",   hover: "hover:border-orange-400/40" },
};

const CATEGORY_LABEL = Object.fromEntries(
  TEMPLATE_CATEGORIES.map((c) => [c.id, c.label])
);

const TemplateCard = ({ template, onUse, isCreating }) => {
  const Icon = ICON_MAP[template.icon] ?? Sparkles;
  const colors = COLOR_MAP[template.color] ?? COLOR_MAP.blue;

  return (
    <div className={`group relative bg-theme-card border border-theme-border rounded-2xl p-6 flex flex-col gap-4 theme-transition ${colors.hover} hover:shadow-lg cursor-default`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${colors.badge}`}>
          {CATEGORY_LABEL[template.category] ?? template.category}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-theme-txt-primary mb-1">{template.title}</h3>
        <p className="text-xs text-theme-txt-secondary/70 leading-relaxed">{template.description}</p>
      </div>

      <button
        onClick={() => onUse(template)}
        disabled={isCreating}
        className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold border theme-transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          border-theme-border text-theme-txt-secondary hover:border-current ${colors.text} hover:bg-theme-btn-sec-hover`}
      >
        {isCreating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5" />
        )}
        {isCreating ? "Creating…" : "Use Template"}
      </button>
    </div>
  );
};

const Templates = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [creatingId, setCreatingId] = useState(null);

  const { mutate: createDocument } = useCreateDocument();

  const filtered =
    activeCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleUse = (template) => {
    if (creatingId) return;
    setCreatingId(template.id);
    createDocument(
      {
        title: template.title,
        type: template.docType,
        workspaceId,
        textContent: template.textContent ?? null,
      },
      {
        onSuccess: (data) => {
          setCreatingId(null);
          navigate(`/documents/${workspaceId}/document/${data.data._id}`);
        },
        onError: () => setCreatingId(null),
      }
    );
  };

  return (
    <div className="p-8 md:p-10 w-full h-full flex flex-col relative z-10 overflow-y-auto">

      <header className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            <p className="text-xs font-bold tracking-widest text-brand-blue uppercase">Templates</p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-txt-primary">
            Start from a template
          </h1>
          <p className="text-sm text-theme-txt-secondary mt-1.5">
            Choose a pre-built document and jump straight to the content that matters.
          </p>
        </div>
        <p className="text-xs text-theme-txt-secondary/50 shrink-0">
          {TEMPLATES.length} templates · {TEMPLATE_CATEGORIES.length} categories
        </p>
      </header>

      {}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {[{ id: "all", label: "All" }, ...TEMPLATE_CATEGORIES].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border theme-transition cursor-pointer ${
              activeCategory === cat.id
                ? "bg-brand-blue text-white border-brand-blue"
                : "border-theme-border text-theme-txt-secondary hover:text-theme-txt-primary hover:border-theme-txt-secondary/40 bg-transparent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={handleUse}
            isCreating={creatingId === template.id}
          />
        ))}
      </div>

    </div>
  );
};

export default Templates;
