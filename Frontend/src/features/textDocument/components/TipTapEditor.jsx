import React, { useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Undo2, 
  Redo2 
} from 'lucide-react'

// ─── Remote Cursor Decoration Plugin ────────────────────────────────────────
const REMOTE_CURSOR_KEY = new PluginKey('remoteCursors');

/**
 * Creates a ProseMirror plugin that renders colored caret lines + name labels
 * for each remote collaborator based on the externally managed cursor map.
 */
function createRemoteCursorPlugin(getCursors) {
  return new Plugin({
    key: REMOTE_CURSOR_KEY,
    props: {
      decorations(state) {
        const cursors = getCursors();
        if (!cursors || Object.keys(cursors).length === 0) return DecorationSet.empty;

        const decorations = [];
        const docSize = state.doc.content.size;

        Object.values(cursors).forEach((cursor) => {
          const { from, to, color, username } = cursor;
          if (from == null || from < 0 || from > docSize) return;

          const clampedFrom = Math.min(Math.max(from, 0), docSize);
          const clampedTo   = Math.min(Math.max(to ?? from, 0), docSize);

          // ── Caret widget at `from` position ──
          const caretEl = window.document.createElement('span');
          caretEl.className = 'remote-cursor-caret';
          caretEl.style.cssText = `
            display: inline-block;
            position: relative;
            border-left: 2px solid ${color};
            height: 1.2em;
            margin-left: -1px;
            vertical-align: text-bottom;
            pointer-events: none;
            z-index: 50;
          `;

          // Name label above caret
          const labelEl = window.document.createElement('span');
          labelEl.className = 'remote-cursor-label';
          labelEl.textContent = username || '?';
          labelEl.style.cssText = `
            position: absolute;
            top: -1.5em;
            left: 0;
            background: ${color};
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            font-family: Inter, sans-serif;
            white-space: nowrap;
            padding: 1px 5px;
            border-radius: 4px 4px 4px 0;
            line-height: 1.6;
            pointer-events: none;
            z-index: 51;
            letter-spacing: 0.02em;
            box-shadow: 0 2px 6px rgba(0,0,0,0.18);
          `;
          caretEl.appendChild(labelEl);

          decorations.push(
            Decoration.widget(clampedFrom, caretEl, { side: -1, key: `caret-${cursor.socketId}` })
          );

          // ── Selection highlight between from → to ──
          if (clampedTo > clampedFrom) {
            decorations.push(
              Decoration.inline(clampedFrom, clampedTo, {
                style: `background: ${color}26; border-radius: 2px;`,
                class: 'remote-cursor-selection',
              }, { key: `sel-${cursor.socketId}` })
            );
          }
        });

        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}

/**
 * TipTap Extension that wires the ProseMirror remote-cursor plugin to the
 * editor. The extension holds a mutable ref to the latest cursor map so the
 * plugin can always read fresh data without being re-created.
 */
const RemoteCursorExtension = Extension.create({
  name: 'remoteCursors',

  addOptions() {
    return { getCursors: () => ({}) };
  },

  addProseMirrorPlugins() {
    return [createRemoteCursorPlugin(this.options.getCursors)];
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

const TipTapEditor = ({ content = null, onChange, socket, currentUser, remoteCursors = {} }) => {
  const [, forceUpdate] = useState(0);
  const hasInitializedRef = useRef(false);
  const remoteCursorsRef = useRef(remoteCursors);

  // Keep the ref always in sync so the plugin closure reads the latest cursors
  useEffect(() => {
    remoteCursorsRef.current = remoteCursors;
  }, [remoteCursors]);

  const defaultJSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Start writing here...' }]
      }
    ]
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      RemoteCursorExtension.configure({
        getCursors: () => remoteCursorsRef.current,
      }),
    ],
    content: content || defaultJSONContent,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[450px] w-full theme-transition text-theme-txt-primary/95 font-sans leading-relaxed text-base py-6 px-4 max-w-none select-text',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      if (!socket) return;
      const { from, to } = editor.state.selection;
      socket.emit('cursor-move', { from, to });
    },
  });

  // Force re-render when remoteCursors change so decorations get repainted
  useEffect(() => {
    if (!editor) return;
    // Trigger a no-op transaction to force decoration re-evaluation
    editor.view.updateState(editor.view.state);
    forceUpdate(n => n + 1);
  }, [remoteCursors, editor]);

  // Structural synchronization of remote collaborative JSON updates while preserving selection
  useEffect(() => {
    if (editor && content) {
      const currentJSON = editor.getJSON();
      
      // Compare serialized JSON structures to avoid infinite loop locks
      if (JSON.stringify(currentJSON) !== JSON.stringify(content)) {
        const { from, to } = editor.state.selection;
        editor.commands.setContent(content, false);
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
          // Ignore selection restore if index is out of bounds
        }
      }
    }
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;

    const listener = () => {
      forceUpdate(prev => prev + 1);
    };

    editor.on('transaction', listener);

    return () => {
      editor.off('transaction', listener);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Active state style checker
  const buttons = [
    {
      icon: Bold,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: Strikethrough,
      title: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },
    {
      icon: Code,
      title: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
    },
    {
      type: 'divider',
    },
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      type: 'divider',
    },
    {
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      type: 'divider',
    },
    {
      icon: Undo2,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
    },
    {
      icon: Redo2,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="w-full flex flex-col border border-theme-border/60 bg-theme-card/45 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Self-contained styling for TipTap components to bypass Tailwind Preflight resets */}
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 450px;
          width: 100%;
          padding: 1.5rem;
          position: relative;
        }
        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.25;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--color-theme-txt-primary, #ffffff);
        }
        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 1.25rem;
          margin-bottom: 0.6rem;
          color: var(--color-theme-txt-primary, #ffffff);
        }
        .ProseMirror h3 {
          font-size: 1.35rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: var(--color-theme-txt-primary, #ffffff);
        }
        .ProseMirror p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.625;
        }
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .ProseMirror li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          list-style-position: outside !important;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          margin-top: 1rem;
          margin-bottom: 1rem;
          background: rgba(59, 130, 246, 0.05);
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .ProseMirror code {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: monospace;
        }
        .ProseMirror pre {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: monospace;
          margin: 1rem 0;
          overflow-x: auto;
        }
        /* Ensure remote cursor carets have correct stacking */
        .remote-cursor-caret {
          animation: cursor-blink 1.1s ease-in-out infinite;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      {/* Editor custom Toolbar */}
      <div className="bg-theme-card border-b border-theme-border/50 px-4 py-2.5 flex items-center flex-wrap gap-1 sticky top-0 z-10">
        {buttons.map((btn, idx) => {
          if (btn.type === 'divider') {
            return <div key={idx} className="h-4 w-px bg-theme-border/50 mx-1.5" />
          }
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              disabled={btn.disabled}
              className={`p-2 rounded-lg hover:bg-theme-btn-sec-hover theme-transition cursor-pointer ${
                btn.isActive 
                  ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' 
                  : 'text-theme-txt-secondary hover:text-theme-txt-primary border border-transparent'
              } ${btn.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={btn.title}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      {/* Editor Content Area */}
      <div className="p-2 overflow-y-auto max-h-[600px] min-h-[450px] relative">
        <EditorContent editor={editor} />
      </div>

    </div>
  )
}

export default TipTapEditor