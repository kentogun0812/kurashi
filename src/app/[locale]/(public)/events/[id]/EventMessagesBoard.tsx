'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, User } from 'lucide-react';
import Image from 'next/image';

export function EventMessagesBoard({ eventId }: { eventId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
    
    // Realtime subscription for new messages
    const channel = supabase
      .channel('public:event_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'event_messages', 
        filter: `event_id=eq.${eventId}` 
      }, async (payload) => {
        // Fetch the user profile for the new message to display it properly
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', payload.new.user_id)
          .single();
          
        const messageWithProfile = {
          ...payload.new,
          profiles: profileData
        };
        
        setMessages(current => [...current, messageWithProfile]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_messages')
        .select(`*, profiles(display_name, avatar_url)`)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true }); // Chronological order
        
      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setError(null);
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Vui lòng đăng nhập để bình luận.");
        setSending(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('event_messages')
        .insert([{
          event_id: eventId,
          content: newMessage.trim(),
          user_id: user.id
        }]);
        
      if (insertError) throw insertError;
      
      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full fade-in">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Chưa có bình luận nào. Hãy là người đầu tiên thảo luận nhé!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary shrink-0 overflow-hidden relative flex items-center justify-center">
                {msg.profiles?.avatar_url ? (
                  <Image src={msg.profiles.avatar_url} alt="Avatar" fill sizes="32px" className="object-cover" />
                ) : (
                  <User size={16} className="text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm">{msg.profiles?.display_name || 'Thành viên'}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="bg-secondary/40 border border-border/50 rounded-2xl rounded-tl-none px-4 py-2 mt-1 text-sm text-foreground break-words">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="pt-4 border-t border-border/50 shrink-0 mt-auto">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập nội dung thảo luận..."
              className="bg-background/50 rounded-xl flex-1"
              disabled={sending}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending} 
              className="rounded-xl glow-primary shrink-0"
              size="icon"
            >
              {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </Button>
          </div>
          {error && <p className="text-xs text-red-500 font-medium px-1">{error}</p>}
        </form>
      </div>
    </div>
  );
}
