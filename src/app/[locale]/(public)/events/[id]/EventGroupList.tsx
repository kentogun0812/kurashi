'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EventGroupList({ eventId }: { eventId: string }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
    
    // Optional: Realtime subscription for new groups
    const channel = supabase
      .channel('public:event_groups')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_groups', filter: `event_id=eq.${eventId}` }, (payload) => {
        setGroups(current => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_groups')
        .select(`*, profiles:created_by(display_name)`)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGroups(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Vui lòng đăng nhập để tạo nhóm.");
        return;
      }

      const { data, error: insertError } = await supabase
        .from('event_groups')
        .insert([{
          event_id: eventId,
          name: groupName,
          description: groupDesc,
          created_by: user.id
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      setGroupName('');
      setGroupDesc('');
      setIsCreating(false);
      // The realtime subscription will pick it up or we can optimistically update
      if (data && !groups.find(g => g.id === data.id)) {
         setGroups([data, ...groups]);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo nhóm.');
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      {!isCreating ? (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 pb-4 scrollbar-hide pr-2">
            {groups.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Chưa có nhóm nào. Hãy là người đầu tiên tạo nhóm nhé!
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold group-hover:text-primary transition-colors">{group.name}</h4>
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-background rounded-full px-2 py-1">
                      <Users size={12} /> {group.member_count}
                    </span>
                  </div>
                  {group.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{group.description}</p>}
                  <div className="text-xs text-muted-foreground">Tạo bởi: <span className="font-semibold">{group.profiles?.display_name || 'Cộng đồng'}</span></div>
                </div>
              ))
            )}
          </div>
          
          <Button 
            onClick={() => setIsCreating(true)} 
            className="w-full h-12 rounded-xl glow-primary gap-2 mt-auto shrink-0"
          >
            <Plus size={18} />
            Tạo nhóm mới
          </Button>
        </>
      ) : (
        <form onSubmit={handleCreateGroup} className="flex flex-col h-full fade-in">
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Tên nhóm <span className="text-red-500">*</span></label>
              <Input 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="VD: Hội đi xem pháo hoa từ Tokyo"
                className="bg-background/50 rounded-xl"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mô tả mục đích (Optional)</label>
              <textarea 
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
                placeholder="Rủ rê đi chung tàu, share tiền vé..."
                rows={3}
                className="w-full p-3 bg-background/50 border border-border/50 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </div>
          
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-border/50 shrink-0">
            <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} className="rounded-xl flex-1">
              Hủy
            </Button>
            <Button type="submit" disabled={!groupName.trim()} className="rounded-xl glow-primary flex-1">
              Khởi tạo
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
