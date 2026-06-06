'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock data for demonstration purposes
const visitData = [
  { name: 'T2', visits: 4000, newUsers: 240 },
  { name: 'T3', visits: 3000, newUsers: 139 },
  { name: 'T4', visits: 2000, newUsers: 980 },
  { name: 'T5', visits: 2780, newUsers: 390 },
  { name: 'T6', visits: 1890, newUsers: 480 },
  { name: 'T7', visits: 2390, newUsers: 380 },
  { name: 'CN', visits: 3490, newUsers: 430 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Lượt truy cập (Visits) */}
      <div className="glass p-6 rounded-xl flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Lượt truy cập (Tuần này)</h3>
          <p className="text-sm text-muted-foreground">
            Dữ liệu mô phỏng (Mock Data). Tích hợp Vercel Analytics để lấy số thực.
          </p>
        </div>
        <div className="h-[300px] w-full min-w-0 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" opacity={0.2} />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="visits" name="Lượt xem" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Đăng ký mới (New Signups) */}
      <div className="glass p-6 rounded-xl flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Người dùng mới (Tuần này)</h3>
          <p className="text-sm text-muted-foreground">
            Tần suất đăng ký tài khoản mới theo ngày.
          </p>
        </div>
        <div className="h-[300px] w-full min-w-0 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" opacity={0.2} />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              />
              <Bar dataKey="newUsers" name="Đăng ký mới" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
