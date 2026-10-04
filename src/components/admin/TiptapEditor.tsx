"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function TiptapEditor({ content, onChange, placeholder = "Write content here..." }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand underline" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[220px] p-4 text-sm text-gray-200 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="h-48 animate-pulse rounded-xl bg-ink-light p-4 text-gray-400">Loading Editor...</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand/20 bg-ink-card shadow-inner">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-brand/10 bg-ink-light/80 p-2 text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2.5 py-1 font-semibold transition-colors ${
            editor.isActive("bold") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2.5 py-1 italic transition-colors ${
            editor.isActive("italic") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded px-2.5 py-1 line-through transition-colors ${
            editor.isActive("strike") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          S
        </button>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded px-2.5 py-1 font-bold transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded px-2.5 py-1 font-bold transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded px-2.5 py-1 font-bold transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          H3
        </button>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2.5 py-1 transition-colors ${
            editor.isActive("bulletList") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          • Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-2.5 py-1 transition-colors ${
            editor.isActive("orderedList") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          1. Numbered
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded px-2.5 py-1 transition-colors ${
            editor.isActive("blockquote") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          “ Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded px-2 py-1 font-mono transition-colors ${
            editor.isActive("codeBlock") ? "bg-brand text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          &lt;/&gt; Code
        </button>

        <div className="mx-1 h-4 w-px bg-white/10" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded px-2 py-1 text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          ↺ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded px-2 py-1 text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          ↻ Redo
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
