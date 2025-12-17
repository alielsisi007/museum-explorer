import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { User, Mail, Ticket, Calendar, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, bookingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  _id: string;
  ticketType: { name: string; price: number };
  quantity: number;
  visitDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsAPI.getMyBookings();
        setBookings(response.data || []);
      } catch (error) {
        console.log('Could not fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authAPI.updateProfile({ name, email });
      updateUser({ name, email });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Could not update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <section className="bg-primary py-16 md:py-20">
        <div className="container-museum">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary-foreground">
                {user?.name}
              </h1>
              <p className="text-primary-foreground/70">{user?.email}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-museum max-w-4xl">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl">
                  <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't made any bookings yet.
                  </p>
                  <Button className="btn-gold" asChild>
                    <a href="/booking">Book Your First Visit</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card p-6 rounded-xl shadow-soft"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span className="font-medium">
                              {format(new Date(booking.visitDate), 'PPP')}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {booking.quantity} × {booking.ticketType?.name || 'Ticket'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-accent">${booking.totalPrice}</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-card p-6 md:p-8 rounded-xl shadow-soft">
                <h2 className="text-xl font-serif font-semibold mb-6">Account Settings</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="btn-gold" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
