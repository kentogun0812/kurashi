"use client";

import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteProcedureButton({ id }: { id: string }) {
  const router = useRouter();
  const t = useTranslations("admin.procedures");
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("administrative_guides")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setIsOpen(false);
      alert(t("deleteSuccess"));
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting procedure:", error);
      alert(`${t("deleteError")} ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <button
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
            title="Xóa"
          />
        }
      >
        <Trash2 size={16} />
      </DialogTrigger>
      
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">{t("deleteConfirm")}</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Hành động này không thể hoàn tác. Dữ liệu bài viết này sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4 gap-3 sm:justify-center">
          <DialogClose 
            render={<Button variant="outline" type="button" disabled={isDeleting} className="min-w-[100px] h-10" />} 
          >
            Hủy
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="min-w-[100px] h-10"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
