import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-primary font-bold">404</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">Trang không tồn tại</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đang trong quá trình phát triển.
      </p>
      <Button render={<Link href="/" />} className="glow-primary rounded-xl px-8 h-12" nativeButton={false}>
        {t('goHome')}
      </Button>
    </div>
  );
}
