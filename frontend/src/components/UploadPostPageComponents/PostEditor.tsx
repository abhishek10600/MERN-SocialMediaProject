import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "../../extensions/FontSize";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const PostEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[140px] p-3 outline-none prose prose-invert max-w-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-neutral-700 rounded-lg bg-neutral-900">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-700 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded font-bold ${
            editor.isActive("bold") ? "bg-purple-600" : "bg-neutral-800"
          }`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded italic ${
            editor.isActive("italic") ? "bg-purple-600" : "bg-neutral-800"
          }`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded underline ${
            editor.isActive("underline") ? "bg-purple-600" : "bg-neutral-800"
          }`}
        >
          U
        </button>

        <div className="w-px h-6 bg-white/20 mx-1" />

        <button
          onClick={() => editor.chain().focus().setFontSize("12px").run()}
          className="px-2 py-1 rounded text-xs bg-neutral-800"
        >
          Small
        </button>

        <button
          onClick={() => editor.chain().focus().setFontSize("16px").run()}
          className="px-2 py-1 rounded text-sm bg-neutral-800"
        >
          Normal
        </button>

        <button
          onClick={() => editor.chain().focus().setFontSize("22px").run()}
          className="px-2 py-1 rounded text-lg bg-neutral-800"
        >
          Large
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default PostEditor;
