import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, User, ArrowRight, Lock } from 'lucide-react';
import { AdminBlogManager, BlogPost } from '../components/home/BlogSection';
import { api } from '../lib/api';
import { Seo } from '../components/seo/Seo';

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: "Maintaining Interlock Stones in Nigerian Humidity",
    excerpt: "Lagos weather can be tough on stone driveways. Learn how to prevent deep-rooted mold and weeds...",
    author: "CleanNaija Experts",
    date: "May 10, 2026",
    image: "/images/service-roof.jpg",
    category: "Maintenance"
  },
  {
    id: '2',
    title: "5 Hygiene Secrets for Corporate Offices in Abuja",
    excerpt: "Maintaining a clinical standard in high-traffic offices requires more than just sweeping...",
    author: "Adunni Clean",
    date: "May 12, 2026",
    image: "/images/service-office.jpg",
    category: "Corporate"
  },
  {
    id: '3',
    title: "Eco-Friendly Cleaning Products for Nigerian Homes",
    excerpt: "Discover safe, effective, and locally available cleaning agents that won't harm your children or pets...",
    author: "CleanNaija Experts",
    date: "May 15, 2026",
    image: "/images/service-home.jpg",
    category: "Health"
  }
];

export function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const loadLocalBlogs = () => {
    const saved = localStorage.getItem('cleannaija_blogs');
    setBlogs(saved ? JSON.parse(saved) : INITIAL_BLOGS);
  };

  useEffect(() => {
    // Prefer live posts from the backend; fall back to local/seed data when
    // the API is unavailable so the page always renders.
    api.blog
      .list()
      .then((posts) => {
        if (posts && posts.length) {
          setBlogs(
            posts.map((p) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt,
              author: p.author || 'CleanNaija Experts',
              date: new Date(p.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              image: p.coverImageUrl || '/images/service-home.jpg',
              category: p.category || 'Insights',
            }))
          );
        } else {
          loadLocalBlogs();
        }
      })
      .catch(loadLocalBlogs);

    window.addEventListener('storage', loadLocalBlogs);
    return () => window.removeEventListener('storage', loadLocalBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-secondary/30 pb-32">
      <Seo
        title="Cleaning Tips & Insights Blog"
        description="Expert cleaning guides for Nigerian homes and businesses — maintenance in humidity, office hygiene, eco-friendly products and more from the CleanNaija team."
        path="/blog"
      />
      <div className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-4 leading-none">CleanNaija Insights</h1>
          <p className="text-accent-gold font-bold uppercase tracking-[0.4em] text-xs">Professional Standards • Local Expertise</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {blogs.map((post) => (
            <Card key={post.id} className="rounded-none border-t-8 border-accent-gold shadow-2xl group cursor-pointer hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <div className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.author}</div>
                  <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.date}</div>
                </div>
                <h2 className="text-xl font-black text-primary uppercase tracking-tighter mb-4 group-hover:text-accent-orange transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <Button variant="ghost" className="p-0 text-accent-gold font-black uppercase text-xs tracking-widest hover:bg-transparent hover:text-primary group">
                  Read Full Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Admin Access Section */}
        <div className="max-w-4xl mx-auto border-t-2 border-gray-100 pt-20">
          {!isAdminMode ? (
            <div className="text-center">
              <button 
                onClick={() => setIsAdminMode(true)}
                className="inline-flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Access</span>
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-center mb-8">
                <Button onClick={() => setIsAdminMode(false)} variant="outline" className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border-gray-200">Exit Admin Mode</Button>
              </div>
              <AdminBlogManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
