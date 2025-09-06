import React, { useState, useEffect } from 'react';

// --- PKCE Helper Functions ---
function toBase64Url(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function randomString(length = 64) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(36)).join('');
}

async function sha256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return await window.crypto.subtle.digest('SHA-256', data);
}

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Replace with your client ID
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'openid email profile';

function App() {
    const [authCode, setAuthCode] = useState('');
    const [idToken, setIdToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState('');

    const startLogin = async () => {
        const codeVerifier = randomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = toBase64Url(hashed);
        sessionStorage.setItem('pkce_code_verifier', codeVerifier);
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: SCOPE,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            access_type: 'offline',
            prompt: 'consent',
        });
        window.location = `${AUTH_URL}?${params.toString()}`;
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
            setAuthCode(code);
            exchangeCodeForTokens(code);
        }
    }, []);

    const exchangeCodeForTokens = async (code) => {
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
        if (!codeVerifier) {
            setError('Missing code verifier.');
            return;
        }
        const body = new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
        });
        try {
            const res = await fetch(TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error_description || data.error);
            } else {
                setIdToken(data.id_token);
                setAccessToken(data.access_token);
            }
        } catch {
            setError('Token exchange failed.');
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>PKCE OAuth2 Demo (Google)</h1>
            <button onClick={startLogin}>Login with Google (PKCE)</button>
            {authCode && <div>Auth Code: <code>{authCode}</code></div>}
            {idToken && <div>ID Token: <code>{idToken}</code></div>}
            {accessToken && <div>Access Token: <code>{accessToken}</code></div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            <p style={{ marginTop: 40 }}>
                <b>How this works:</b><br />
                1. Click the button to start PKCE login.<br />
                2. App generates a code verifier/challenge and redirects to Google.<br />
                3. After login, Google redirects back with a code.<br />
                4. App exchanges the code + verifier for tokens.<br />
                <br />
                <b>Setup:</b><br />
                - Replace <code>CLIENT_ID</code> with your Google OAuth client ID.<br />
                - Set redirect URI in Google Cloud Console to <code>http://localhost:3000</code>.<br />
                - Run <code>npm install &amp;&amp; npm start</code> in this folder.<br />
            </p>
        </div>
    );
}

export default App;
