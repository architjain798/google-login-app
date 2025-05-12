import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameter
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Remove token from URL for security
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Fetch user data with token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.get('http://localhost:5000/api/user', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then(response => setUser(response.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token'); // Clear invalid token
        });
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (!user) {
    return <div>Not logged in. <a href="/">Go to Home</a></div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;