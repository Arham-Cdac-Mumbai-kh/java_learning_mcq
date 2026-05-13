import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Code, Award, ArrowRight, Sparkles, Terminal, Trophy } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      <section className="grid min-h-[calc(100vh-8rem)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 text-sm font-bold text-primary-700 shadow-sm dark:border-primary-900 dark:bg-slate-900/80 dark:text-primary-300">
            <Sparkles size={16} /> Java OOP learning path
          </div>
          <div className="space-y-5">
            <p className="eyebrow">Master concepts. Crack interviews.</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-tight text-slate-950 dark:text-white md:text-7xl">
              Become fluent in <span className="text-primary-600">Java OOP</span>, one mission at a time.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A focused learning platform with crisp notes, interview drills, quiz missions, and a Java playground built for serious revision.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-8 py-3 text-lg">
              Start Learning <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-lg">Continue Journey</Link>
          </div>
          <div className="grid max-w-2xl grid-cols-3 gap-3">
            <Stat value="14" label="OOP modules" />
            <Stat value="300+" label="MCQs" />
            <Stat value="1" label="Playground" />
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Main.java</span>
            </div>
            <div className="code-grid p-6 font-mono text-sm leading-7">
              <p><span className="text-primary-400">class</span> Learner <span className="text-slate-500">{'{'}</span></p>
              <p className="pl-5"><span className="text-sky-300">String</span> skill = <span className="text-green-300">"Object Oriented Java"</span>;</p>
              <p className="pl-5"><span className="text-sky-300">void</span> grow() <span className="text-slate-500">{'{'}</span></p>
              <p className="pl-10">practice.notes();</p>
              <p className="pl-10">solve.mcqs();</p>
              <p className="pl-10">build.confidence();</p>
              <p className="pl-5 text-slate-500">{'}'}</p>
              <p className="text-slate-500">{'}'}</p>
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 right-6 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-glow dark:border-slate-800 dark:bg-slate-900">
            <MiniMetric icon={<Trophy size={18} />} label="Interview ready" />
            <MiniMetric icon={<Terminal size={18} />} label="Hands-on code" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FeatureCard
          icon={<BookOpen className="text-primary-600" size={32} />}
          title="Structured Learning"
          description="14 comprehensive modules covering everything from basic OOP to advanced Streams API."
        />
        <FeatureCard
          icon={<Award className="text-primary-600" size={32} />}
          title="Interactive MCQs"
          description="Test your knowledge with 25 curated MCQs per topic, each with detailed explanations."
        />
        <FeatureCard
          icon={<Code className="text-primary-600" size={32} />}
          title="Coding Playground"
          description="Write and test Java snippets in our integrated playground to solidify your understanding."
        />
      </div>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div className="rounded-lg border border-slate-200 bg-white/80 p-4 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
    <p className="text-3xl font-black text-slate-950 dark:text-white">{value}</p>
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
  </div>
);

const MiniMetric = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
      {icon}
    </span>
    {label}
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="card group space-y-4 hover:-translate-y-1 hover:border-primary-300">
    <div className="inline-grid h-14 w-14 place-items-center rounded-lg bg-primary-50 ring-1 ring-primary-100 dark:bg-primary-950/40 dark:ring-primary-900">
      {icon}
    </div>
    <h3 className="text-xl font-black group-hover:text-primary-600">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

export default Home;
