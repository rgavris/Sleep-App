# 🌙 SleepTracker - Your Personal Sleep Companion

A modern, feature-rich sleep tracking application built with React, Next.js, TypeScript, and Material-UI. Track your sleep patterns, analyze sleep quality, and improve your sleep habits with comprehensive analytics and goal setting.

## ✨ Features

### 🎯 Sleep Tracking
- **Real-time sleep session tracking** with start/stop functionality
- **Sleep quality assessment** (Excellent, Good, Fair, Poor)
- **Sleep stage estimation** (Deep Sleep, Light Sleep, REM Sleep, Awake Time)
- **Session notes and tags** for detailed sleep journaling
- **Automatic duration calculation** and timestamp recording

### 📊 Analytics & Insights
- **Interactive charts** using Recharts library
- **Multiple chart types**: Bar charts, pie charts, area charts, line charts
- **Time-based filtering**: Week, Month, Year views
- **Sleep efficiency metrics** and trend analysis
- **Sleep quality distribution** visualization
- **Sleep stages breakdown** analysis

### 🎯 Goal Setting & Progress
- **Customizable sleep goals** with target duration, bedtime, and wake time
- **Progress tracking** with visual indicators
- **Quality targets** for continuous improvement
- **Goal achievement celebrations** and progress monitoring

### 🏠 Dashboard Overview
- **Real-time sleep status** based on time of day
- **Quick statistics** with beautiful gradient cards
- **Recent activity feed** showing latest sleep sessions
- **Sleep trend indicators** (Improving, Stable, Declining)
- **Consistency scoring** for sleep pattern analysis

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Material-UI components** with custom styling
- **Styled-components** for advanced CSS-in-JS
- **Framer Motion animations** for smooth interactions
- **Dark-themed navigation** with glassmorphism effects
- **Tailwind CSS utilities** for additional styling

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with Next.js 14
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Styled-components + Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Package Manager**: Bun (compatible with npm/yarn)
- **Build Tool**: Next.js built-in bundler
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Local Storage

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SleepApp
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Run the development server**
   ```bash
   # Using Bun
   bun run dev
   
   # Or using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
SleepApp/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Material-UI theme
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles and Tailwind imports
│   ├── components/
│   │   ├── Navigation.tsx      # Sidebar navigation component
│   │   ├── Dashboard.tsx       # Main dashboard overview
│   │   ├── SleepTracker.tsx    # Sleep session tracking
│   │   ├── SleepAnalytics.tsx  # Charts and analytics
│   │   └── SleepGoals.tsx      # Goal setting and tracking
│   └── types/
│       └── sleep.ts            # TypeScript type definitions
├── package.json                 # Dependencies and scripts
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🎮 Usage

### Getting Started
1. **Dashboard**: View your sleep overview and recent activity
2. **Sleep Tracker**: Start tracking your sleep sessions
3. **Analytics**: Explore detailed sleep data and trends
4. **Goals**: Set and monitor your sleep improvement goals

### Tracking Sleep
1. Click "Start Sleep" when going to bed
2. The app will track your sleep duration in real-time
3. Click "Wake Up" when you wake up
4. Rate your sleep quality and add optional notes
5. Save the session to your sleep history

### Setting Goals
1. Navigate to the Goals section
2. Click "Add Goal" to create a new sleep goal
3. Set target duration, bedtime, and wake time
4. Choose your target sleep quality
5. Monitor progress towards your goals

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_APP_NAME=SleepTracker
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Customization
- **Theme**: Modify the Material-UI theme in `src/app/layout.tsx`
- **Colors**: Update the color palette in `tailwind.config.js`
- **Components**: Customize component styles in individual component files

## 📱 Responsive Design

The app is fully responsive and works on:
- **Desktop**: Full sidebar navigation with detailed views
- **Tablet**: Adaptive layout with collapsible navigation
- **Mobile**: Mobile-first design with touch-friendly interactions

## 🚀 Deployment

### Build for Production
```bash
# Using Bun
bun run build
bun run start

# Or using npm
npm run build
npm run start

# Or using yarn
yarn build
yarn start
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Recharts** for the excellent charting capabilities
- **Framer Motion** for smooth animations
- **Next.js** for the amazing React framework
- **Tailwind CSS** for utility-first CSS framework

## 📞 Support

If you have any questions or need help:
- Create an issue in the GitHub repository
- Check the documentation in the code comments
- Review the TypeScript types for component props

---

**Happy sleeping! 🌙✨**

*Built with ❤️ using modern web technologies*

