import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Code, HelpCircle, ArrowRight, ChevronLeft, Award } from 'lucide-react';

const TopicDetail = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicRes, mcqRes] = await Promise.all([
          api.get(`/topics/${id}`),
          api.get(`/mcqs/${id}`)
        ]);
        setTopic(topicRes.data);
        setMcqs(mcqRes.data);
      } catch (error) {
        console.error('Error fetching topic data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading Content...</div>;
  if (!topic) return <div>Topic not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link>
        <span> / </span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">{topic.title}</span>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-lg">
        <div className="bg-primary-600 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
          <p className="text-primary-100 text-lg">{topic.description}</p>
        </div>

        <div className="flex border-b dark:border-slate-700 overflow-x-auto">
          {['notes', 'examples', 'interview', 'practice', 'quiz'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2
                ${activeTab === tab
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {tab === 'notes' && 'Notes'}
              {tab === 'examples' && 'Examples'}
              {tab === 'interview' && 'Interview'}
              {tab === 'practice' && 'Practice'}
              {tab === 'quiz' && 'Start Quiz'}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <BookOpen size={20} />
                <h2 className="text-xl font-bold">Detailed Notes</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                {topic.notes}
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <Code size={20} />
                <h2 className="text-xl font-bold">Code Examples</h2>
              </div>
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 italic">{topic.examples}</p>
                <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-sm overflow-x-auto border border-slate-700">
                  <pre><code>{topic.codeSnippets}</code></pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <HelpCircle size={20} />
                <h2 className="text-xl font-bold">Common Interview Questions</h2>
              </div>
              <div className="grid gap-4">
                {topic.interviewQuestions.map((q, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-medium">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary-600 mb-4">
                <Code size={20} />
                <h2 className="text-xl font-bold">Practice Exercises</h2>
              </div>
              <div className="grid gap-4">
                {topic.practiceQuestions.map((q, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <p className="font-medium">{q}</p>
                    <Link to="/playground" className="text-xs btn-primary py-1 px-3">Try in Playground</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600">
                <Award size={48} />
              </div>
              <h2 className="text-2xl font-bold">Ready to test your knowledge?</h2>
              <p className="text-slate-500 max-w-md">
                You'll face 25 MCQs based on this topic. All questions must be answered to complete the module.
              </p>
              <Link to={`/quiz/${id}`} className="btn-primary px-12 py-4 text-lg flex items-center gap-2">
                Start Quiz <ArrowRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
