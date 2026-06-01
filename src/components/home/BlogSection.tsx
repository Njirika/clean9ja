import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, User, ArrowRight, Trash2, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, ApiBlogPost, tokenStore, API_URL } from '../../lib/api';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

function mapApiPost(p: ApiBlogPost): BlogPost {
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author || 'CleanNaija Experts',
    date: new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    image: p.coverImageUrl || '/images/service-home.jpg',
    category: p.category || 'Insights',
  };
}

// Kept for backward compatibility — no longer used locally
export const INITIAL_BLOGS: BlogPost[] = [];

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.blog.list()
      .then(posts => setBlogs((posts || []).map(mapApiPost)))
      .catch(() => setBlogs([]));
  }, []);

  return (
    <section className="py-32 bg-white font-sans border-t border-gray-100 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center text-accent-gold font-black text-[10px] uppercase tracking-[0.3em] mb-4">Knowledge is Power</div>
          <h2 className="text-5xl md:text-6xl font-heading font-black text-primary uppercase tracking-tighter mb-6">CleanNaija Blog</h2>
          <div className="w-24 h-2 bg-accent-gold mx-auto mb-8"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Expert advice for the Nigerian environment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.slice(0, 3).map((post) => (
            <Card key={post.id} className="rounded-none border-t-8 border-accent-gold shadow-xl group cursor-pointer hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-64 overflow-hidden bg-secondary">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                  {post.category}
                </div>
              </div>
              <div className="p-10 bg-white">
                <div className="flex items-center space-x-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <div className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.author}</div>
                  <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-accent-gold" /> {post.date}</div>
                </div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-4 group-hover:text-accent-orange transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to="/blog" className="inline-flex items-center text-accent-orange font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors group">
                  Read Article <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link to="/blog">
            <Button className="bg-primary text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-none shadow-2xl hover:bg-accent-gold hover:text-primary transition-all">
              Explore Full Blog Hub
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AdminBlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    category: 'Maintenance',
    image: '/images/service-home.jpg',
  });

  const loadBlogs = () => {
    setLoading(true);
    api.blog.list()
      .then(posts => setBlogs((posts || []).map(mapApiPost)))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBlogs(); }, []);

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setPublishError(null);
    try {
      const token = tokenStore.get();
      const res = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: newPost.title,
          excerpt: newPost.excerpt,
          content: newPost.excerpt,
          category: newPost.category,
          coverImageUrl: newPost.image,
          isPublished: true,
        }),
        credentials: 'include',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as any)?.message || 'Could not publish post.');
      }
      setShowForm(false);
      setNewPost({ title: '', excerpt: '', category: 'Maintenance', image: '/images/service-home.jpg' });
      loadBlogs();
    } catch (err: any) {
      setPublishError(err?.message || 'Failed to publish.');
    } finally {
      setPublishing(false);
    }
  };

  const deletePost = async (id: string) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    try {
      const token = tokenStore.get();
      await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
    } catch {
      loadBlogs();
    }
  };

  return (
    <div className="p-8 bg-white border-4 border-primary shadow-2xl">
      <div className="flex justify-between items-center mb-8 border-b-4 border-accent-gold pb-6">
        <h2 className="text-2xl font-black text-primary uppercase tracking-tighter flex items-center">
          <LayoutDashboard className="mr-3 w-6 h-6 text-accent-gold" /> Blog Command Center
        </h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary text-white uppercase font-black tracking-widest text-[10px] px-6 py-3 rounded-none">
          {showForm ? 'Cancel' : 'Create New Post'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={addPost} className="mb-12 p-8 bg-secondary/30 space-y-6 border-l-8 border-accent-gold animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-primary tracking-widest">Article Title</label>
              <input required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full p-4 border border-gray-100 focus:outline-primary font-bold text-sm" />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-primary tracking-widest">Category</label>
              <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full p-4 border border-gray-100 focus:outline-primary font-bold text-sm">
                <option>Maintenance</option>
                <option>Corporate</option>
                <option>Industry News</option>
                <option>Health & Safety</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase text-primary tracking-widest">Excerpt</label>
            <textarea required value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} className="w-full p-4 border border-gray-100 focus:outline-primary font-bold text-sm h-32" />
          </div>
          {publishError && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-[10px] font-black text-red-600 uppercase tracking-wider">{publishError}</div>}
          <Button type="submit" disabled={publishing} className="w-full bg-accent-orange text-white font-black uppercase tracking-[0.2em] py-5 shadow-2xl rounded-none transition-all hover:bg-primary disabled:opacity-60">
            {publishing ? 'Publishing…' : 'Publish Article'}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Published Articles</h3>
        {loading ? (
          <div className="py-8 text-center text-gray-400 font-black uppercase tracking-widest text-xs">Loading articles…</div>
        ) : blogs.length === 0 ? (
          <div className="py-8 text-center text-gray-400 font-black uppercase tracking-widest text-xs">No articles yet. Create your first post above.</div>
        ) : blogs.map(post => (
          <div key={post.id} className="flex items-center justify-between p-6 border border-gray-100 bg-white hover:bg-secondary/20 transition-colors">
            <div className="flex items-center space-x-6">
              <img src={post.image} alt={post.title} className="w-16 h-16 object-cover" />
              <div>
                <h4 className="font-black text-primary uppercase text-sm">{post.title}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date} • {post.category}</p>
              </div>
            </div>
            <button onClick={() => deletePost(post.id)} className="text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
