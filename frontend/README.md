# Evo-Tech Frontend

Next.js 14 frontend application for the Evo-Tech Bangladesh e-commerce platform.

## Features

- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- User authentication with NextAuth
- Product browsing and shopping cart
- Admin dashboard for content management
- SEO optimized with Next.js
- State management with Redux Toolkit

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- NextAuth.js
- Radix UI components
- Axios for API calls
- React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3009
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3009](http://localhost:3009) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── (admins)/          # Admin dashboard routes
│   ├── (auth)/            # Authentication pages
│   ├── (users)/           # User-facing pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Auth components
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── store/                # Redux store and slices
├── utils/                # Helper functions
└── ...
```

## Key Pages

- `/` - Home page with product listings
- `/auth/login` - User login
- `/auth/register` - User registration
- `/admins/control/dashboard` - Admin dashboard
- `/admins/control/products` - Product management
- `/admins/control/orders` - Order management

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - NextAuth base URL

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Deployment

This app can be deployed to Vercel, Netlify, or any platform supporting Next.js.

For Vercel deployment:
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test your changes

## License

MIT License
