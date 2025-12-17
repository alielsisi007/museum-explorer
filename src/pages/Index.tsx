import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Ticket, Users, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-museum.jpg';

const exhibits = [
  {
    id: '1',
    title: 'Ancient Civilizations',
    description: 'Explore artifacts from Egypt, Greece, and Rome spanning thousands of years.',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Renaissance Masters',
    description: 'Masterpieces from the Italian Renaissance including rare works and sculptures.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Modern Art Gallery',
    description: 'Contemporary works from world-renowned artists pushing creative boundaries.',
    image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&auto=format&fit=crop',
  },
];

const upcomingEvents = [
  {
    date: 'Dec 20',
    title: 'Night at the Museum',
    description: 'Exclusive after-hours tour with guided exploration',
  },
  {
    date: 'Dec 25',
    title: 'Holiday Special Exhibition',
    description: 'Winter wonderland themed art installations',
  },
  {
    date: 'Jan 5',
    title: 'Artist Meet & Greet',
    description: 'Meet contemporary artists and discuss their work',
  },
];

const stats = [
  { icon: Ticket, value: '50K+', label: 'Visitors Yearly' },
  { icon: Star, value: '200+', label: 'Exhibits' },
  { icon: Users, value: '100+', label: 'Events' },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Museum grand hall"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
        
        <div className="container-museum relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight mb-6">
              Discover the Beauty of{' '}
              <span className="text-accent">Human History</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Journey through time and explore masterpieces from ancient civilizations to contemporary art. Experience culture like never before.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking">
                <Button className="btn-gold text-base">
                  Book Your Visit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/exhibits">
                <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Exhibits
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-12">
        <div className="container-museum">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Exhibits */}
      <section className="section-padding bg-background">
        <div className="container-museum">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Featured Exhibits
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most celebrated collections and discover the stories behind each masterpiece.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exhibits.map((exhibit, index) => (
              <motion.article
                key={exhibit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-museum group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                    {exhibit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {exhibit.description}
                  </p>
                  <Link
                    to="/exhibits"
                    className="inline-flex items-center text-accent font-medium text-sm hover:underline"
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/exhibits">
              <Button variant="outline" size="lg">
                View All Exhibits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-secondary">
        <div className="container-museum">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground mb-8">
                Join us for exclusive events, guided tours, and special exhibitions throughout the year.
              </p>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-4 bg-card rounded-lg shadow-soft"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-accent/10 rounded-lg flex flex-col items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent mb-1" />
                      <span className="text-xs font-medium text-accent">{event.date}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary rounded-2xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-serif font-bold text-primary-foreground mb-4">
                Plan Your Visit
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>Open Daily: 9 AM - 6 PM</span>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span>123 Museum Avenue, Art District</span>
                </div>
                <div className="flex items-center gap-3 text-primary-foreground/80">
                  <Ticket className="w-5 h-5 text-accent" />
                  <span>Tickets from $15</span>
                </div>
              </div>
              <Link to="/booking">
                <Button className="w-full btn-gold">
                  Get Tickets Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
