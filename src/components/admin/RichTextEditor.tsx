"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Quote, Undo, Redo, 
  ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Table as TableIcon
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    
    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white/5 border-b border-white/10 rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("bold") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("italic") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("strike") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("heading", { level: 1 }) ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("heading", { level: 2 }) ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("bulletList") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("orderedList") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("blockquote") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Blockquote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive({ textAlign: 'left' }) ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive({ textAlign: 'center' }) ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive({ textAlign: 'right' }) ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-white/10 transition ${editor.isActive("link") ? "bg-white/20 text-white" : "text-slate-400"}`}
        type="button" title="Insert Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-white/10 transition text-slate-400"
        type="button" title="Insert Image URL"
      >
        <ImageIcon size={16} />
      </button>
      <button
        onClick={addTable}
        className="p-2 rounded hover:bg-white/10 transition text-slate-400"
        type="button" title="Insert Table"
      >
        <TableIcon size={16} />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-white/10 transition text-slate-400 disabled:opacity-50"
        type="button" title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-white/10 transition text-slate-400 disabled:opacity-50"
        type="button" title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ 
  content, 
  onChange 
}: { 
  content: string; 
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-brand max-w-none focus:outline-none min-h-[300px] p-4 text-slate-300',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#111] focus-within:border-brand-primary/50 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
