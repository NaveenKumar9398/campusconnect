"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AmbassadorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [proofUrl, setProofUrl] = useState('');
  const [activeTask, setActiveTask] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem('role') !== 'AMBASSADOR') {
      router.push('/');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const userRes = await fetch('/api/user');
    const { ambassador } = await userRes.json();
    setUser(ambassador);

    const tasksRes = await fetch('/api/tasks');
    setTasks(await tasksRes.json());

    const lbRes = await fetch('/api/user?type=leaderboard');
    setLeaderboard(await lbRes.json());
  };

  const submitTask = async (e: any) => {
    e.preventDefault();
    await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: activeTask, proofUrl })
    });
    setProofUrl('');
    setActiveTask(null);
    alert('Submitted successfully!');
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h1>Ambassador Dashboard</h1>
        <button onClick={() => { localStorage.clear(); router.push('/'); }} style={{ backgroundColor: 'var(--danger)' }}>Logout</button>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Points</h3>
          <p className="text-2xl" style={{ color: 'var(--warning)' }}>{user.points}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Level</h3>
          <p className="text-2xl" style={{ color: 'var(--primary)' }}>{user.level}</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Streak</h3>
          <p className="text-2xl" style={{ color: 'var(--success)' }}>{user.streak} days 🔥</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2>Available Tasks</h2>
          <div style={{ marginTop: '1rem' }}>
            {tasks.map((task: any) => (
              <div key={task.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                <div className="flex justify-between items-center mb-4">
                  <strong>{task.title}</strong>
                  <span className="badge warning">+{task.points} pts</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
                
                {activeTask === task.id ? (
                  <form onSubmit={submitTask}>
                    <input placeholder="Proof URL (e.g. LinkedIn post link)" value={proofUrl} onChange={e => setProofUrl(e.target.value)} required />
                    <div className="flex" style={{ gap: '0.5rem' }}>
                      <button type="submit" style={{ backgroundColor: 'var(--success)' }}>Submit</button>
                      <button type="button" onClick={() => setActiveTask(null)} style={{ backgroundColor: 'var(--danger)' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setActiveTask(task.id)}>Complete Task</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Leaderboard</h2>
          <div style={{ marginTop: '1rem' }}>
            {leaderboard.map((lbUser: any, index: number) => (
              <div key={lbUser.id} className="flex justify-between items-center" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <strong style={{ marginRight: '0.5rem' }}>#{index + 1}</strong>
                  {lbUser.name}
                  {index === 0 && ' 👑'}
                </div>
                <div>{lbUser.points} pts (Lvl {lbUser.level})</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
