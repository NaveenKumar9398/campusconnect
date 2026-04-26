"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run seed automatically
    fetch('/api/seed').then(() => setLoading(false));
  }, []);

  const loginAsAdmin = () => {
    localStorage.setItem('role', 'ADMIN');
    router.push('/admin');
  };

  const loginAsAmbassador = () => {
    localStorage.setItem('role', 'AMBASSADOR');
    router.push('/ambassador');
  };

  if (loading) return <div className="container">Loading CampusConnect...</div>;

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>CampusConnect</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: '#94a3b8' }}>
        The Centralized Campus Ambassador Management Platform
      </p>

      <div className="grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card">
          <h2 className="mb-4">Admin Portal</h2>
          <p className="mb-4" style={{ color: '#94a3b8' }}>Manage cohorts, create tasks, and approve submissions.</p>
          <button onClick={loginAsAdmin} style={{ width: '100%' }}>Login as Admin</button>
        </div>

        <div className="card">
          <h2 className="mb-4">Ambassador Portal</h2>
          <p className="mb-4" style={{ color: '#94a3b8' }}>Complete tasks, climb the leaderboard, and earn rewards.</p>
          <button onClick={loginAsAmbassador} style={{ width: '100%', backgroundColor: 'var(--success)' }}>Login as Ambassador</button>
        </div>
      </div>
    </div>
  );
}
