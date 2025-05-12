# Google Login App

This project is a simple implementation of a Google Login feature for a web application. It demonstrates how to integrate Google's OAuth 2.0 authentication system to allow users to log in using their Google accounts.

## Features
- Google OAuth 2.0 authentication.
- Secure login flow.
- Easy integration into existing web applications.

## Prerequisites
- A Google Cloud Platform (GCP) project with OAuth 2.0 credentials.
- Basic knowledge of web development and authentication.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/google-login-app.git
    cd google-login-app
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure your Google OAuth credentials in the `.env` file:
    ```env
    CLIENT_ID=your-google-client-id
    CLIENT_SECRET=your-google-client-secret
    REDIRECT_URI=http://localhost:3000/auth/callback
    ```
4. Start the application:
    ```bash
    npm start
    ```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Click the "Login with Google" button to authenticate using your Google account.

## Learning Resource
This project was implemented based on the tutorial available at [Grok](https://grok.com/share/bGVnYWN5_1f418137-8955-4f73-be2f-9154d1272bf8).

## Acknowledgments
Special thanks to Grok for providing the tutorial and guidance for implementing this feature.