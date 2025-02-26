# Compliance-Frontend

This repo is the frontend for the compliance scanner. You will also need to run the corresponding backend.

![Dashboard Image](/docs/images/dashboard.png)

### Install dependencies

- Node 20.0.0
- React 19

```bash
# Install deps with npm
npm run install
```

### Set up .env.local

Create a file in the root directory called .env.local, fill in the following:

```
NEXT_PUBLIC_API_PATH=http://localhost:8080
NEXT_PUBLIC_FRONTEND_PATH=http://localhost:3000
NEXT_PUBLIC_SUPABASE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth/callback
NEXT_PUBLIC_SUPABASE_OAUTH_CLIENT_ID=
SUPABASE_OAUTH_CLIENT_SECRET=
```

### Run the project

```bash
# Start project in dev mode
npm run dev
# Build project
npm run build
```
