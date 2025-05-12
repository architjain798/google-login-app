import React from 'react';

function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <a href="http://localhost:5000/auth/google">
        <button>Login with Google</button>
      </a>
    </div>
  );
}

export default Home;