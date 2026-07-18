'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';

export function NewsContent({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension,
      ImageExtension,
    ],
    content: JSON.parse(content),
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="tiptap-content">
      <EditorContent editor={editor} />
    </div>
  );
}
