import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/user', { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return <div>Not logged in. <a href="/">Go to Home</a></div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.emails[0].value}</p>
      <a href="http://localhost:5000/logout">
        <button>Logout</button>
      </a>
    </div>
  );
}

export default Dashboard;