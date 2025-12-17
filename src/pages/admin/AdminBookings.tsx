import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Search, Loader2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookingsAPI } from "@/lib/bookingsAPI";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  _id: string;
  user?: { userName: string; email: string };
  quantity: number;
  visitDate: string;
  totalPrice: number;
  status: string;
  ticketType?: { name: string };
  createdAt: string;
}

const AdminBookings = () => {
  const [ bookings, setBookings ] = useState<Booking[]>( [] );
  const [ search, setSearch ] = useState( "" );
  const [ isLoading, setIsLoading ] = useState( true );
  const { toast } = useToast();

  useEffect( () => {
    fetchBookings();
  }, [] );

  const fetchBookings = async () => {
    setIsLoading( true );
    try {
      const response = await bookingsAPI.getAll();
      setBookings( response.data?.bookings || [] );
    } catch ( error ) {
      toast( { title: "Error fetching bookings", variant: "destructive" } );
    } finally {
      setIsLoading( false );
    }
  };

  const handleCancel = async ( id: string ) => {
    if ( !confirm( "Cancel this booking?" ) ) return;
    try {
      await bookingsAPI.cancel( id );
      toast( { title: "Booking Cancelled" } );
      fetchBookings();
    } catch ( error ) {
      toast( { title: "Error", description: "Could not cancel booking.", variant: "destructive" } );
    }
  };

  const getStatusColor = ( status: string ) => {
    switch ( status ) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const filteredBookings = bookings.filter( ( b ) =>
    b.user?.userName?.toLowerCase().includes( search.toLowerCase() ) ||
    b.user?.email?.toLowerCase().includes( search.toLowerCase() )
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">View and manage all bookings</p>
      </div>

      <div className="mb-6 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={ search }
          onChange={ ( e ) => setSearch( e.target.value ) }
          className="pl-10"
        />
      </div>

      { isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Customer</th>
                  <th className="text-left px-6 py-4 font-medium hidden md:table-cell">Visit Date</th>
                  <th className="text-left px-6 py-4 font-medium hidden lg:table-cell">Tickets</th>
                  <th className="text-left px-6 py-4 font-medium">Amount</th>
                  <th className="text-left px-6 py-4 font-medium">Status</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                { filteredBookings.map( ( booking, i ) => (
                  <motion.tr
                    key={ booking._id }
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    transition={ { delay: i * 0.05 } }
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{ booking.user?.userName || "Guest" }</p>
                        <p className="text-sm text-muted-foreground">{ booking.user?.email || "—" }</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      { format( new Date( booking.visitDate ), "MMM d, yyyy" ) }
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      { booking.quantity } × { booking.ticketType?.name || "Ticket" }
                    </td>
                    <td className="px-6 py-4 font-semibold text-accent">${ booking.totalPrice }</td>
                    <td className="px-6 py-4">
                      <span className={ `px-2 py-1 text-xs font-medium rounded-full ${ getStatusColor( booking.status ) }` }>
                        { booking.status }
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        { booking.status !== "cancelled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={ () => handleCancel( booking._id ) }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) }
                      </div>
                    </td>
                  </motion.tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }
    </div>
  );
};

export default AdminBookings;
