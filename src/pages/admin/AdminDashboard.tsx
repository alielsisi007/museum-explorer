import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Ticket, Image, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { adminAPI } from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalExhibits: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalExhibits: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        // Use fallback data
        setStats({
          totalUsers: 1250,
          totalBookings: 3420,
          totalRevenue: 85600,
          totalExhibits: 42,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      trend: '+12%',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      icon: Ticket,
      trend: '+8%',
      color: 'bg-green-500',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+23%',
      color: 'bg-accent',
    },
    {
      title: 'Exhibits',
      value: stats.totalExhibits.toString(),
      icon: Image,
      trend: '+2',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card p-6 rounded-xl shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{isLoading ? '—' : stat.value}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-accent" />
            Recent Bookings
          </h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', date: 'Dec 15', tickets: 3, amount: 75 },
              { name: 'Jane Smith', date: 'Dec 14', tickets: 2, amount: 50 },
              { name: 'Mike Johnson', date: 'Dec 14', tickets: 5, amount: 125 },
              { name: 'Sarah Wilson', date: 'Dec 13', tickets: 1, amount: 25 },
            ].map((booking, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.tickets} tickets</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-accent">${booking.amount}</p>
                  <p className="text-sm text-muted-foreground">{booking.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Night at the Museum', date: 'Dec 20', attendees: 150 },
              { title: 'Holiday Exhibition', date: 'Dec 25', attendees: 300 },
              { title: 'Artist Meet & Greet', date: 'Jan 5', attendees: 75 },
              { title: 'New Year Special', date: 'Jan 1', attendees: 200 },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <span className="text-sm bg-secondary px-3 py-1 rounded-full">
                  {event.attendees} attendees
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
