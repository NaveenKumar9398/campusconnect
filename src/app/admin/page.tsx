"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', points: 10, type: 'CONTENT' });

  useEffect(() => {
    if (localStorage.getItem('role') !== 'ADMIN') {
      router.push('/');
    } else {
      fetchTasks();
      fetchSubmissions();
    }
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };

  const fetchSubmissions = async () => {
    const res = await fetch('/api/submissions');
    setSubmissions(await res.json());
  };

  const handleCreateTask = async (e: any) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    setNewTask({ title: '', description: '', points: 10, type: 'CONTENT' });
    fetchTasks();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await fetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchSubmissions();
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button onClick={() => { localStorage.clear(); router.push('/'); }} style={{ backgroundColor: 'var(--danger)' }}>Logout</button>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Create Task</h2>
          <form onSubmit={handleCreateTask} style={{ marginTop: '1rem' }}>
            <input placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
            <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required />
            <input type="number" placeholder="Points" value={newTask.points} onChange={e => setNewTask({...newTask, points: parseInt(e.target.value)})} required />
            <select value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}>
              <option value="CONTENT">Content Creation</option>
              <option value="PROMOTION">Promotion</option>
              <option value="REFERRAL">Referral</option>
            </select>
            <button type="submit">Create Task</button>
          </form>
        </div>

        <div className="card">
          <h2>Pending Submissions</h2>
          <div style={{ marginTop: '1rem' }}>
            {submissions.filter((s: any) => s.status === 'PENDING').map((sub: any) => (
              <div key={sub.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <strong>{sub.user?.name}</strong> submitted for <em>{sub.task?.title}</em>
                <br />
                <a href={sub.proofUrl} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Proof</a>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleStatusUpdate(sub.id, 'APPROVED')} style={{ backgroundColor: 'var(--success)', padding: '0.25rem 0.5rem' }}>Approve</button>
                  <button onClick={() => handleStatusUpdate(sub.id, 'REJECTED')} style={{ backgroundColor: 'var(--danger)', padding: '0.25rem 0.5rem' }}>Reject</button>
                </div>
              </div>
            ))}
            {submissions.filter((s: any) => s.status === 'PENDING').length === 0 && <p>No pending submissions.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
