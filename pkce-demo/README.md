# PKCE Demo Project

This is a minimal demo showing how to implement OAuth 2.0 Authorization Code Flow with PKCE in a single-page application (SPA) using only a frontend (no backend required).

## Structure
- `frontend/` — React app that demonstrates PKCE with Google OAuth

## How it works
- The React app generates a code verifier and code challenge.
- It redirects the user to Google’s OAuth endpoint with the code challenge.
- After login, Google redirects back with an authorization code.
- The app exchanges the code + code verifier for tokens directly from the browser.

## Prerequisites
- Register an OAuth client in Google Cloud Console as a public client (no client secret required).
- Set the redirect URI to `http://localhost:3001` (or your chosen port).

## To run
1. Go to `frontend/` and run `npm install && npm start`.
2. Follow the instructions in the app.

---

This demo is for educational purposes and omits production security best practices (like secure storage of tokens).
