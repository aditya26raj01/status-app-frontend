# Next.js App Setup

This is a basic setup guide for a Next.js application.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**

   ```bash
   cd <project-directory>
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_API_URL=<your-backend-url>
```

Replace `<your-backend-url>` with the URL of your backend API.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

## Running in Production

To run the app in production mode:

```bash
npm start
```

Ensure that you have set the `NEXT_PUBLIC_API_URL` in your environment variables before starting the application.
