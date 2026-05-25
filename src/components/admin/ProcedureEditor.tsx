"use client";

import { useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface ProcedureEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function ProcedureEditor({ value, onChange }: ProcedureEditorProps) {
  const supabase = createClient();
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync theme with Tailwind's .dark class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Custom image upload handler for BlockNote
  const uploadFile = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `guides/${fileName}`;

    const { error } = await supabase.storage
      .from("procedure_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      alert("Có lỗi khi tải ảnh lên. Vui lòng thử lại.");
      throw error;
    }

    const { data } = supabase.storage
      .from("procedure_images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  useEffect(() => {
    async function initEditor() {
      const newEditor = BlockNoteEditor.create({
        uploadFile,
      });

      // Only parse initial value once when the editor mounts
      if (value) {
        const blocks = await newEditor.tryParseMarkdownToBlocks(value);
        newEditor.replaceBlocks(newEditor.document, blocks);
      }
      
      setEditor(newEditor);
    }
    
    initEditor();
    
    // Cleanup if needed
    return () => {
      setEditor(null);
    };
  }, []); // Run only once on mount

  const handleChange = async () => {
    if (!editor) return;
    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    onChange(markdown);
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[600px] border border-border/80 rounded-xl bg-background/50 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm font-semibold text-muted-foreground">Đang tải bộ soạn thảo...</span>
      </div>
    );
  }

  return (
    <div className="relative group flex flex-col h-full min-h-[600px] border border-border/80 rounded-xl overflow-hidden shadow-sm bg-background">
      <div className="flex-1 p-2 md:p-4 [&_.bn-container]:min-h-[500px]">
        <BlockNoteView
          editor={editor}
          theme={theme}
          onChange={handleChange}
        />
      </div>
      
      <div className="bg-secondary/30 border-t border-border/50 px-4 py-3 flex items-start gap-2 mt-auto shrink-0">
        <span className="text-lg leading-none">💡</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Mẹo sử dụng (Notion Style):</strong> Gõ phím <strong className="text-primary px-1 bg-primary/10 rounded">/</strong> để mở menu định dạng (Heading, Bullet list, v.v.). 
          <br/>Bạn có thể <strong className="text-primary">kéo thả ảnh</strong> trực tiếp vào khung soạn thảo để tự động tải lên và chèn vào bài viết.
        </p>
      </div>
    </div>
  );
}
