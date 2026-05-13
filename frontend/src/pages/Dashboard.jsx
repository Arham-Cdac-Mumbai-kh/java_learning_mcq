import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, CheckCircle, TrendingUp, ArrowRight, Flame, Target } from 'lucide-react';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUserProgress = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error refreshing profile', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [topicsRes] = await Promise.all([
          api.get('/topics'),
          refreshUserProgress()
        ]);
        setTopics(topicsRes.data);
      } catch (error) {
        console.error('Error loading dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">Loading Dashboard...</div>;

  const completedCount = Object.keys(user?.progress || {}).length;
  const overallProgress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-2xl">
        <div className="code-grid grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-8">
          <div className="space-y-4">
            <p className="eyebrow text-primary-400">Learning dashboard</p>
            <h1 className="text-3xl font-black md:text-5xl">Welcome back, {user?.username}</h1>
            <p className="max-w-2xl text-slate-300">
              Keep moving through the Java OOP track. Complete modules, revise concepts, and turn each quiz into interview confidence.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge icon={<Flame size={16} />} label={`${completedCount} modules completed`} />
              <Badge icon={<Target size={16} />} label={`${topics.length} total missions`} />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-500 text-slate-950">
                <TrendingUp />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Overall progress</p>
                <p className="text-3xl font-black">{overallProgress}%</p>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="eyebrow">Course map</p>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Choose your next OOP mission</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {topics.map(topic => (
          <div key={topic.id} className="card group cursor-pointer hover:-translate-y-1 hover:border-primary-300" onClick={() => navigate(`/topic/${topic.id}`)}>
            <div className="mb-4 flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100 dark:bg-primary-950/50 dark:ring-primary-900">
                <BookOpen size={24} />
              </div>
              {user?.progress?.[topic.id] === 100 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
                  <CheckCircle size={14} /> Done
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl font-black transition-colors group-hover:text-primary-600">{topic.title}</h3>
            <p className="mb-6 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{topic.description}</p>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800">
                {topic.id.replace('-', ' ').toUpperCase()}
              </span>
              <Link to={`/topic/${topic.id}`} className="inline-flex items-center gap-1 text-sm font-black text-primary-600">
                Explore <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Badge = ({ icon, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200">
    <span className="text-primary-400">{icon}</span>
    {label}
  </span>
);

export default Dashboard;
