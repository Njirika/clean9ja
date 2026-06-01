import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Clock, User, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../components/home/BlogSection';
import { api } from '../lib/api';
import { Seo } from '../components/seo/Seo';

export function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    // Live posts from the backend CMS only — no mock fallback.
    api.blog
      .list()
      .then((posts) =>
        setBlogs(
          (posts || []).map((p) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            author: p.author || 'Clean9ja Experts',
            date: new Date(p.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            image: p.coverImageUrl || '/images/service-home.jpg',
            category: p.category || 'Insights',
          }))
        )
      )
      .catch(() => setBlogs([]));
  }, []);

  return (
    <div className="min-h-screen bg-secondary/30 pb-32">
      <Seo
        title="Cleaning Tips & Insights Blog"
        description="Expert cleaning guides for Nigerian homes and businesses — maintenance in humidity, office hygiene, eco-friendly products and more from the Clean9ja team."
        path="/blog"
      />
      <div className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-4 leading-none">Clean9ja Insights</h1>
          <p className="text-accent-gold font-bold text-xs">Professional Standards • Local Expertise</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {blogs === null ? (
          <div className="text-center py-32 text-gray-400 font-black text-xs">Loading insights…</div>
        ) : blogs.length === 0 ? (
          <div className="bg-white shadow-2xl border-t-8 border-accent-gold max-w-2xl mx-auto p-16 text-center">
            <h2 className="text-2xl font-black text-primary tracking-tighter mb-3">No articles yet</h2>
            <p className="text-gray-500 font-bold text-[11px] leading-relaxed">
              Our experts are preparing fresh cleaning insights. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {blogs.map((post) => (
              <Card key={post.id} className="rounded-none border-t-8 border-accent-gold shadow-2xl group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-3 py-1.5">
                    {post.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-[9px] font-black text-gray-400 mb-4">
                    <div className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.author}</div>
                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.date}</div>
                  </div>
                  <h2 className="text-xl font-black text-primary tracking-tighter mb-4 group-hover:text-accent-orange transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 text-accent-gold font-black text-xs hover:bg-transparent hover:text-primary group">
                    Read Full Story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
