import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Minus, Plus, Ticket, CreditCard, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ticketsAPI, bookingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TicketType {
  _id: string;
  name: string;
  price: number;
  description?: string;
}

const fallbackTicketTypes: TicketType[] = [
  { _id: '1', name: 'Adult', price: 25, description: 'Ages 18+' },
  { _id: '2', name: 'Child', price: 12, description: 'Ages 3-17' },
  { _id: '3', name: 'Senior', price: 18, description: 'Ages 65+' },
  { _id: '4', name: 'Student', price: 15, description: 'With valid ID' },
];

const Booking = () => {
  const [date, setDate] = useState<Date>();
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(fallbackTicketTypes);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [step, setStep] = useState<'select' | 'payment' | 'confirmation'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await ticketsAPI.getTypes();
        if (response.data?.length > 0) {
          setTicketTypes(response.data);
        }
      } catch (error) {
        console.log('Using fallback ticket types');
      }
    };
    fetchTicketTypes();
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = ticketTypes.reduce(
    (sum, type) => sum + type.price * (quantities[type._id] || 0),
    0
  );

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to book tickets.',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/booking' } });
      return;
    }

    if (!date) {
      toast({
        title: 'Select a Date',
        description: 'Please select a visit date.',
        variant: 'destructive',
      });
      return;
    }

    if (totalTickets === 0) {
      toast({
        title: 'Select Tickets',
        description: 'Please select at least one ticket.',
        variant: 'destructive',
      });
      return;
    }

    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking
      const selectedTicket = ticketTypes.find((t) => quantities[t._id] > 0);
      if (selectedTicket && date) {
        await bookingsAPI.create({
          ticketType: selectedTicket._id,
          quantity: totalTickets,
          visitDate: date.toISOString(),
          totalPrice,
        });
      }

      setStep('confirmation');
      toast({
        title: 'Booking Confirmed!',
        description: 'Your tickets have been booked successfully.',
      });
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'There was an error processing your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="bg-primary py-16 md:py-24">
        <div className="container-museum">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Book Your Visit
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Select your preferred date and tickets to plan your museum experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-museum max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {['Select', 'Payment', 'Confirmation'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                    index === 0 && step === 'select' && 'bg-accent text-accent-foreground',
                    index === 1 && step === 'payment' && 'bg-accent text-accent-foreground',
                    index === 2 && step === 'confirmation' && 'bg-accent text-accent-foreground',
                    (step === 'payment' && index === 0) || (step === 'confirmation' && index < 2)
                      ? 'bg-accent text-accent-foreground'
                      : '',
                    step === 'select' && index > 0 && 'bg-muted text-muted-foreground',
                    step === 'payment' && index > 1 && 'bg-muted text-muted-foreground'
                  )}
                >
                  {(step === 'payment' && index === 0) || (step === 'confirmation' && index < 2) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
                {index < 2 && <div className="w-8 md:w-16 h-px bg-border mx-4" />}
              </div>
            ))}
          </div>

          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Date Selection */}
              <div className="bg-card p-6 rounded-xl shadow-soft">
                <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-accent" />
                  Select Date
                </h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Ticket Selection */}
              <div className="bg-card p-6 rounded-xl shadow-soft">
                <h2 className="text-xl font-serif font-semibold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-accent" />
                  Select Tickets
                </h2>
                <div className="space-y-4">
                  {ticketTypes.map((type) => (
                    <div
                      key={type._id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        <p className="text-accent font-semibold">${type.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(type._id, -1)}
                          disabled={(quantities[type._id] || 0) === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantities[type._id] || 0}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(type._id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="md:col-span-2 bg-primary p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-primary-foreground">
                    <p className="text-sm opacity-80">Total ({totalTickets} tickets)</p>
                    <p className="text-3xl font-serif font-bold">${totalPrice}</p>
                  </div>
                  <Button
                    className="btn-gold w-full sm:w-auto"
                    onClick={handleProceedToPayment}
                    disabled={!date || totalTickets === 0}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-card p-8 rounded-xl shadow-soft">
                <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-accent" />
                  Payment (Simulation)
                </h2>

                <div className="mb-6 p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Order Summary</p>
                  <p className="font-medium">Date: {date && format(date, 'PPP')}</p>
                  <p className="font-medium">Tickets: {totalTickets}</p>
                  <p className="text-xl font-bold text-accent mt-2">Total: ${totalPrice}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-6 p-4 bg-accent/10 rounded-lg">
                  This is a payment simulation. No real payment will be processed.
                </p>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep('select')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="btn-gold flex-1"
                    onClick={handleConfirmPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Confirm Payment'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="bg-card p-8 rounded-xl shadow-soft">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your tickets have been booked successfully. A confirmation email has been sent to your email address.
                </p>
                <div className="p-4 bg-secondary rounded-lg mb-6">
                  <p className="font-medium">Visit Date: {date && format(date, 'PPP')}</p>
                  <p className="font-medium">Total Tickets: {totalTickets}</p>
                  <p className="font-bold text-accent">Amount Paid: ${totalPrice}</p>
                </div>
                <Button onClick={() => navigate('/profile')} className="btn-gold">
                  View My Bookings
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
