import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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

const TipTapEditor = ({ content = null, onChange, socket, currentUser }) => {
  const [, forceUpdate] = useState(0);
  const isApplyingRemoteUpdateRef = useRef(false);

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
    ],
    content: content || defaultJSONContent,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[450px] w-full theme-transition text-theme-txt-primary/95 font-sans leading-relaxed text-base py-6 px-4 max-w-none select-text',
      },
    },
    onUpdate: ({ editor }) => {
      if (isApplyingRemoteUpdateRef.current) return;
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && content) {
      const currentJSON = editor.getJSON();
      
      if (JSON.stringify(currentJSON) !== JSON.stringify(content)) {
        const { from, to } = editor.state.selection;
        isApplyingRemoteUpdateRef.current = true;
        editor.commands.setContent(content, false);
        try {
          editor.commands.setTextSelection({ from, to });
        } catch (e) {
        }
        setTimeout(() => {
          isApplyingRemoteUpdateRef.current = false;
        }, 0);
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
      
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 380px;
          width: 100%;
          padding: 0.75rem;
          position: relative;
        }
        @media (min-width: 640px) {
          .ProseMirror {
            padding: 1.5rem;
            min-height: 450px;
          }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
        .remote-cursor-caret {
          animation: cursor-blink 1.1s ease-in-out infinite;
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div className="bg-theme-card border-b border-theme-border/50 px-3 py-2 flex items-center gap-1 sticky top-0 z-10 overflow-x-auto max-w-full whitespace-nowrap scrollbar-none md:flex-wrap md:px-4 md:py-2.5">
        {buttons.map((btn, idx) => {
          if (btn.type === 'divider') {
            return <div key={idx} className="h-4 w-px bg-theme-border/50 mx-1.5 shrink-0" />
          }
          const Icon = btn.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              disabled={btn.disabled}
              className={`p-2 rounded-lg hover:bg-theme-btn-sec-hover theme-transition cursor-pointer shrink-0 ${
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

      <div className="p-2 overflow-y-auto max-h-[600px] min-h-[380px] sm:min-h-[450px] relative">
        <EditorContent editor={editor} />
      </div>

    </div>
  )
}

export default TipTapEditor