import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Ticket, DollarSign, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const COLORS = ['#d97706', '#1e40af', '#059669', '#7c3aed'];

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5100 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6200 },
    { month: 'May', revenue: 7100 },
    { month: 'Jun', revenue: 8500 },
    { month: 'Jul', revenue: 9200 },
    { month: 'Aug', revenue: 8800 },
    { month: 'Sep', revenue: 7600 },
    { month: 'Oct', revenue: 8100 },
    { month: 'Nov', revenue: 9500 },
    { month: 'Dec', revenue: 11200 },
  ];

  const visitorsData = [
    { day: 'Mon', visitors: 420 },
    { day: 'Tue', visitors: 380 },
    { day: 'Wed', visitors: 510 },
    { day: 'Thu', visitors: 450 },
    { day: 'Fri', visitors: 620 },
    { day: 'Sat', visitors: 890 },
    { day: 'Sun', visitors: 780 },
  ];

  const ticketTypeData = [
    { name: 'Adult', value: 45 },
    { name: 'Child', value: 25 },
    { name: 'Senior', value: 18 },
    { name: 'Student', value: 12 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await adminAPI.getAnalytics();
      } catch (error) {
        console.log('Using mock analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track performance and visitor insights</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'This Month Revenue', value: '$11,200', icon: DollarSign, change: '+18%' },
          { label: 'Monthly Visitors', value: '4,050', icon: Users, change: '+12%' },
          { label: 'Tickets Sold', value: '1,234', icon: Ticket, change: '+8%' },
          { label: 'Growth Rate', value: '23%', icon: TrendingUp, change: '+5%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-4 rounded-xl shadow-soft"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-accent" />
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: 'hsl(var(--accent))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Ticket Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card p-6 rounded-xl shadow-soft lg:col-span-2"
        >
          <h3 className="text-lg font-semibold mb-4">Ticket Type Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ticketTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ticketTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4">
              {ticketTypeData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
