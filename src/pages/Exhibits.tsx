import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, MapPin } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { exhibitsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Exhibit {
  _id: string;
  name: string;
  description: string;
  image?: string;
  location?: string;
  duration?: string;
  category?: string;
}

const fallbackExhibits: Exhibit[] = [
  {
    _id: '1',
    name: 'Ancient Egyptian Treasures',
    description: 'Discover the mysteries of ancient Egypt through a stunning collection of artifacts, mummies, and royal treasures spanning over 3,000 years.',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&auto=format&fit=crop',
    location: 'Wing A, Floor 1',
    duration: '45 min',
    category: 'Ancient History',
  },
  {
    _id: '2',
    name: 'Renaissance Masterpieces',
    description: 'Experience the golden age of art with works from Leonardo, Michelangelo, and Raphael in our acclaimed Renaissance gallery.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop',
    location: 'Wing B, Floor 2',
    duration: '60 min',
    category: 'Art',
  },
  {
    _id: '3',
    name: 'Contemporary Visions',
    description: 'Explore cutting-edge installations and thought-provoking pieces from the most influential artists of our time.',
    image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&auto=format&fit=crop',
    location: 'Wing C, Floor 3',
    duration: '30 min',
    category: 'Modern Art',
  },
  {
    _id: '4',
    name: 'Asian Art & Culture',
    description: 'Journey through the artistic traditions of China, Japan, and Southeast Asia with ceramics, textiles, and paintings.',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop',
    location: 'Wing D, Floor 1',
    duration: '50 min',
    category: 'Cultural Heritage',
  },
  {
    _id: '5',
    name: 'Greek & Roman Antiquities',
    description: 'Marvel at classical sculptures, pottery, and architectural elements from ancient Mediterranean civilizations.',
    image: 'https://images.unsplash.com/photo-1608376630927-2573f4fe3f7d?w=800&auto=format&fit=crop',
    location: 'Wing A, Floor 2',
    duration: '40 min',
    category: 'Ancient History',
  },
  {
    _id: '6',
    name: 'Impressionist Garden',
    description: 'Immerse yourself in the light and color of Monet, Renoir, and other Impressionist masters.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop',
    location: 'Wing B, Floor 1',
    duration: '35 min',
    category: 'Art',
  },
];

const Exhibits = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>(fallbackExhibits);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await exhibitsAPI.getAll();
        if (response.data?.exhibits?.length > 0) {
          setExhibits(response.data.exhibits);
        }
      } catch (error) {
        console.log('Using fallback exhibits data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExhibits();
  }, []);

  const filteredExhibits = exhibits.filter((exhibit) =>
    exhibit.name.toLowerCase().includes(search.toLowerCase()) ||
    exhibit.description.toLowerCase().includes(search.toLowerCase()) ||
    exhibit.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container-museum">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
              Our Exhibits
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Explore our world-class collection spanning centuries of human creativity and achievement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-background py-8 border-b border-border sticky top-16 md:top-20 z-30">
        <div className="container-museum">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search exhibits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="section-padding bg-background">
        <div className="container-museum">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">
                Showing {filteredExhibits.length} exhibits
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExhibits.map((exhibit, index) => (
                  <motion.article
                    key={exhibit._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="card-museum group"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={exhibit.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop'}
                        alt={exhibit.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      {exhibit.category && (
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-3">
                          {exhibit.category}
                        </span>
                      )}
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                        {exhibit.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {exhibit.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {exhibit.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exhibit.location}
                          </span>
                        )}
                        {exhibit.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {exhibit.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}

          {filteredExhibits.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No exhibits found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Exhibits;
