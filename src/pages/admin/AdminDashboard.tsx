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
    <div className="px-2 sm:px-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Grid */ }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        { statCards.map( ( stat, index ) => (
          <motion.div
            key={ stat.title }
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { delay: index * 0.1 } }
            className="bg-card p-4 md:p-6 rounded-xl shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs md:text-sm truncate">{ stat.title }</p>
                <p className="text-lg md:text-2xl font-bold mt-1">{ isLoading ? '—' : stat.value }</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-xs md:text-sm">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{ stat.trend }</span>
                </div>
              </div>
              <div className={ `${ stat.color } p-2 md:p-3 rounded-lg shrink-0` }>
                <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ) ) }
      </div>

      {/* Recent Activity */ }
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={ { opacity: 0, x: -20 } }
          animate={ { opacity: 1, x: 0 } }
          className="bg-card p-4 md:p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
            <Ticket className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            Recent Bookings
          </h2>
          <div className="space-y-3 md:space-y-4">
            { isLoadingRecents ? (
              <div className="flex justify-center py-6">Loading…</div>
            ) : recentBookings.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent bookings</div>
            ) : (
              recentBookings.map( ( b, i ) => (
                <div key={ b._id || i } className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{ b.user?.userName || b.user?.userName || 'Guest' }</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{ ( b.user && b.user.email ) || '—' }</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="font-semibold text-accent text-sm md:text-base">${ b.totalPrice }</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{ format( new Date( b.visitDate || b.createdAt ), 'MMM d' ) }</p>
                  </div>
                </div>
              ) )
            ) }
          </div>
        </motion.div>

        <motion.div
          initial={ { opacity: 0, x: 20 } }
          animate={ { opacity: 1, x: 0 } }
          className="bg-card p-4 md:p-6 rounded-xl shadow-soft"
        >
          <h2 className="text-base md:text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            Upcoming Events
          </h2>
          <div className="space-y-3 md:space-y-4">
            { isLoadingRecents ? (
              <div className="flex justify-center py-6">Loading…</div>
            ) : events.length === 0 ? (
              <div className="text-sm text-muted-foreground">No upcoming events</div>
            ) : (
              events.map( ( event, i ) => (
                <div key={ event._id || i } className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm md:text-base truncate">{ event.name || event.title }</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{ event.location || format( new Date( event.createdAt || event.updatedAt || Date.now() ), 'MMM d' ) }</p>
                  </div>
                  <span className="text-xs md:text-sm bg-secondary px-2 md:px-3 py-1 rounded-full shrink-0 ml-2">View</span>
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
