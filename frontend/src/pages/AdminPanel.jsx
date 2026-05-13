import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ListChecks,
  Save,
  Trash2,
} from "lucide-react";

const AdminPanel = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    topicCount: 0,
    mcqCount: 0,
  });
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, topicsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/topics"),
        ]);
        setStats(statsRes.data);
        setTopics(topicsRes.data);
      } catch (error) {
        console.error("Admin data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading Admin Panel...
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard size={32} className="text-primary-600" />
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Users />}
          label="Total Users"
          value={stats.userCount}
        />
        <StatCard
          icon={<BookOpen />}
          label="Total Topics"
          value={stats.topicCount}
        />
        <StatCard
          icon={<ListChecks />}
          label="Total MCQs"
          value={stats.mcqCount}
        />
      </div>

      <div className="card space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage Content</h2>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Save size={16} /> Add New Topic
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 uppercase font-bold">
              <tr>
                <th className="p-3">Topic Name</th>
                <th className="p-3">ID</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {topics.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="p-3 font-medium">{topic.title}</td>
                  <td className="p-3 font-mono text-xs">{topic.id}</td>
                  <td className="p-3 flex gap-3">
                    <button className="text-primary-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="card flex items-center gap-4">
    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-primary-600">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 uppercase font-bold">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminPanel;
