import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Award, ArrowRight, RefreshCcw } from 'lucide-react';

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchMcqs = async () => {
      try {
        const response = await api.get(`/mcqs/${topicId}`);
        setMcqs(response.data);
      } catch (error) {
        console.error('Error fetching MCQs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMcqs();
  }, [topicId]);

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === mcqs[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      try {
        await api.post('/quizzes/submit', {
          topicId,
          score,
          totalQuestions: mcqs.length
        });
      } catch (error) {
        console.error('Error updating progress', error);
      }
      setIsFinished(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading Quiz...</div>;
  if (mcqs.length === 0) return <div className="text-center h-64">No MCQs found for this topic.</div>;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto card text-center space-y-8 py-12">
        <div className="flex justify-center">
          <div className="p-6 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600">
            <Award size={64} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-slate-500">You've successfully challenged your knowledge of this module.</p>
        </div>
        <div className="text-6xl font-black text-primary-600">
          {Math.round((score / mcqs.length) * 100)}%
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{mcqs.length}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/dashboard')} className="btn-primary px-8">Back to Dashboard</button>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-2 border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <RefreshCcw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = mcqs[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Question {currentIndex + 1} of {mcqs.length}
        </span>
        <div className="h-2 w-48 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card space-y-8">
        <h2 className="text-2xl font-bold leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => {
            let style = "p-4 rounded-xl border-2 transition-all cursor-pointer text-left ";
            if (!isAnswered) {
              style += "border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20";
            } else {
              if (index === currentQuestion.correctAnswer) {
                style += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
              } else if (index === selectedOption) {
                style += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
              } else {
                style += "border-slate-200 dark:border-slate-700 opacity-60";
              }
            }

            return (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={style}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && index === currentQuestion.correctAnswer && <CheckCircle size={20} />}
                  {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && <XCircle size={20} />}
                </div>
              </div>
            );
          })}
        </div>

        {isAnswered && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-primary-600 space-y-2 animate-in fade-in slide-in-from-bottom-4">
            <p className="text-sm font-bold text-primary-600 uppercase">Explanation</p>
            <p className="text-slate-600 dark:text-slate-400 italic">{currentQuestion.explanation}</p>
            <button
              onClick={nextQuestion}
              className="mt-4 btn-primary w-full flex items-center justify-center gap-2"
            >
              {currentIndex === mcqs.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
