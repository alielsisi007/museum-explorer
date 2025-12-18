import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Ticket, Image, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { adminAPI, bookingsAPI, exhibitsAPI } from '@/lib/api';
import { format } from 'date-fns';

interface Stats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalExhibits: number;
}

const AdminDashboard = () => {
  const [ stats, setStats ] = useState<Stats>( {
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalExhibits: 0,
  } );
  const [ isLoading, setIsLoading ] = useState( true );
  const [ recentBookings, setRecentBookings ] = useState<any[]>( [] );
  const [ events, setEvents ] = useState<any[]>( [] );
  const [ isLoadingRecents, setIsLoadingRecents ] = useState( true );

  useEffect( () => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats( response.data );
      } catch ( error ) {
        // Use fallback data
        setStats( {
          totalUsers: 1250,
          totalBookings: 3420,
          totalRevenue: 85600,
          totalExhibits: 42,
        } );
      } finally {
        setIsLoading( false );
      }
    };
    fetchStats();
    // fetch recent bookings and upcoming exhibits in parallel
    const fetchRecents = async () => {
      setIsLoadingRecents( true );
      try {
        const [ bookingsRes, exhibitsRes ] = await Promise.all( [
          bookingsAPI.getAll( { page: 1, limit: 5 } ),
          exhibitsAPI.getAll( { page: 1, limit: 4 } ),
        ] );

        setRecentBookings( bookingsRes.data?.bookings || [] );
        setEvents( exhibitsRes.data?.exhibits || [] );
      } catch ( err ) {
        // keep arrays empty on failure
        console.error( 'Failed to load recents', err );
      } finally {
        setIsLoadingRecents( false );
      }
    };
    fetchRecents();
  }, [] );

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
      value: `$${ stats.totalRevenue.toLocaleString() }`,
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

      {/* Stats Grid */ }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        { statCards.map( ( stat, index ) => (
          <motion.div
            key={ stat.title }
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { delay: index * 0.1 } }
            className="bg-card p-6 rounded-xl shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{ stat.title }</p>
                <p className="text-2xl font-bold mt-1">{ isLoading ? '—' : stat.value }</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{ stat.trend }</span>
                </div>
              </div>
              <div className={ `${ stat.color } p-3 rounded-lg` }>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ) ) }
      </div>

      {/* Recent Activity */ }
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={ { opacity: 0, x: -20 } }
          animate={ { opacity: 1, x: 0 } }
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-accent" />
            Recent Bookings
          </h2>
          <div className="space-y-4">
            { isLoadingRecents ? (
              <div className="flex justify-center py-6">Loading…</div>
            ) : recentBookings.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent bookings</div>
            ) : (
              recentBookings.map( ( b, i ) => (
                <div key={ b._id || i } className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{ b.user?.userName || b.user?.userName || 'Guest' }</p>
                    <p className="text-sm text-muted-foreground">{ ( b.user && b.user.email ) || '—' }</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">${ b.totalPrice }</p>
                    <p className="text-sm text-muted-foreground">{ format( new Date( b.visitDate || b.createdAt ), 'MMM d' ) }</p>
                  </div>
                </div>
              ) )
            ) }
          </div>
        </motion.div>

        <motion.div
          initial={ { opacity: 0, x: 20 } }
          animate={ { opacity: 1, x: 0 } }
          className="bg-card p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Upcoming Events
          </h2>
          <div className="space-y-4">
            { isLoadingRecents ? (
              <div className="flex justify-center py-6">Loading…</div>
            ) : events.length === 0 ? (
              <div className="text-sm text-muted-foreground">No upcoming events</div>
            ) : (
              events.map( ( event, i ) => (
                <div key={ event._id || i } className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{ event.name || event.title }</p>
                    <p className="text-sm text-muted-foreground">{ event.location || format( new Date( event.createdAt || event.updatedAt || Date.now() ), 'MMM d' ) }</p>
                  </div>
                  <span className="text-sm bg-secondary px-3 py-1 rounded-full">View</span>
                </div>
              ) )
            ) }
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
