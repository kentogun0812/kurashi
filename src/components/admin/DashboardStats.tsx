'use client';

import { Users, FileText, Calendar, ShoppingBag } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalGuides: number;
    totalEvents: number;
    totalListings: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      title: 'Tổng số người dùng',
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Bài viết thủ tục',
      value: stats.totalGuides,
      icon: <FileText className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Sự kiện cộng đồng',
      value: stats.totalEvents,
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Bài rao vặt',
      value: stats.totalListings,
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div key={index} className="glass p-6 rounded-xl flex items-center gap-4">
          <div className={`p-4 rounded-lg ${item.bgColor}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
