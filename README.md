# Waystone - D&D Campaign Management Platform

A comprehensive web-based platform for creating, managing, and playing Dungeons & Dragons campaigns online. Waystone provides Dungeon Masters and players with all the tools needed for immersive tabletop roleplaying experiences.

## 🎯 Features

### For Dungeon Masters
- **Campaign Creation & Management**: Design detailed campaigns with custom settings, rules, and storylines
- **Character Management**: Create and manage NPCs, enemies, and player characters with detailed stat blocks
- **Map Builder**: Visual map creation tool with locations, buildings, and regions
- **Session Planning**: Organize game sessions, track progress, and manage campaign lore
- **Battle Maps**: Interactive battle maps for combat encounters with DM and player views
- **Campaign Sharing**: Publish campaigns as free content or share privately with players

### For Players
- **Character Creation**: Build detailed D&D characters with abilities, equipment, and backstories
- **Session Participation**: Join campaigns via session codes and access shared content
- **Interactive Maps**: Explore game worlds through player-specific map views
- **Real-time Gameplay**: Participate in live sessions with battle maps and character interactions

### Core Functionality
- **User Authentication**: Secure registration and login system with Firebase
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Real-time Updates**: Live synchronization between DM and players during sessions
- **Campaign Archive**: Store and retrieve completed campaigns for future reference

## 🛠 Technology Stack

### Frontend
- **React 19.2.0** - Modern React with latest features
- **React Router DOM 7.10.0** - Client-side routing
- **Vite 7.2.4** - Fast development build tool
- **CSS3** - Custom styling with responsive design

### Backend & Services
- **Firebase 12.6.0** - Authentication, Firestore database, and storage
- **Firebase Auth** - User authentication and authorization
- **Firestore** - NoSQL document database for campaign data
- **Firebase Storage** - File storage for images and assets

### Development Tools
- **ESLint** - Code quality and consistency
- **React DevTools** - Development debugging
- **Vite HMR** - Hot module replacement for fast development

## 📁 Project Structure

```
waystoneProject/
├── public/                 # Static assets
├── src/
│   ├── api/               # API layer and Firebase operations
│   │   ├── userCampaigns.js    # Campaign CRUD operations
│   │   ├── npcs.js              # NPC management
│   │   ├── players.js           # Player data operations
│   │   └── firestore.js         # Database utilities
│   ├── components/        # Reusable UI components
│   │   ├── UI/                 # Header, Footer, Sidebar
│   │   ├── character/          # Character-related components
│   │   ├── map/               # Map and navigation components
│   │   ├── popups/            # Modal dialogs and overlays
│   │   └── turn/              # Turn-based gameplay components
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── firebase/          # Firebase configuration
│   │   ├── Auth.js            # Authentication functions
│   │   └── firebase.js        # Firebase app initialization
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main application pages
│   │   ├── Login_Page.jsx          # User authentication
│   │   ├── Main_Page.jsx           # Dashboard and campaign overview
│   │   ├── New_Campaign_Page_*.jsx # Campaign creation wizards
│   │   ├── Map_*.jsx               # Map viewing and editing
│   │   ├── Add_*.jsx               # Character/NPC/Enemy creation
│   │   └── HelpPage.jsx            # Documentation and help
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component with routing
│   └── main.jsx           # Application entry point
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── index.html            # HTML template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase project configuration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Waystone.git
   cd Waystone/waystoneProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase configuration to `src/firebase/firebase.js`
   - Update the `firebaseConfig` object with your project credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎮 Usage Guide

### For Dungeon Masters

1. **Create Account**: Register with email and password
2. **Start New Campaign**: Navigate to "New Campaign" to set up your adventure
3. **Build Your World**: Use the Map Builder to create locations and regions
4. **Populate with Characters**: Add NPCs, enemies, and story elements
5. **Invite Players**: Share session codes with your players
6. **Run Sessions**: Use battle maps and character sheets during gameplay

### For Players

1. **Join Campaign**: Enter the session code provided by your DM
2. **Create Character**: Build your D&D character with abilities and equipment
3. **Explore Maps**: Navigate through the game world using interactive maps
4. **Participate in Sessions**: Join live gameplay sessions with real-time updates

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Email/Password authentication
2. **Firestore**: Create collections for Users, Campaigns, Characters, etc.
3. **Storage**: Configure for image uploads and file storage
4. **Security Rules**: Set appropriate read/write permissions for data protection

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

We welcome contributions to improve Waystone! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Use ESLint to maintain code quality
- Test new features thoroughly
- Update documentation for any API changes
- Ensure responsive design for mobile compatibility

## 📚 API Documentation

### Campaign Management
- `getAllCampaigns(userId)` - Retrieve user's campaigns
- `createCampaign(campaignData)` - Create new campaign
- `updateCampaign(campaignId, data)` - Update campaign details
- `archiveCampaign(campaignId)` - Archive completed campaigns

### Character Operations
- `createCharacter(characterData)` - Add new character to campaign
- `updateCharacter(characterId, data)` - Modify character stats
- `getCharactersByCampaign(campaignId)` - Retrieve campaign characters

### Session Management
- `generateSessionCode()` - Create unique session codes
- `joinSession(sessionCode, userId)` - Player joins campaign session
- `updateSessionState(sessionId, state)` - Real-time session updates

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Verify Firebase configuration in `src/firebase/firebase.js`
   - Check network connectivity and Firebase service status

2. **Authentication Problems**
   - Ensure Firebase Auth is enabled in your project
   - Check email/password authentication settings

3. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for outdated dependencies with `npm outdated`

4. **Performance Issues**
   - Optimize Firestore queries with proper indexing
   - Implement pagination for large datasets
   - Use React.memo for component optimization

### Getting Help

- Check the in-app Help page for detailed guides
- Review the FAQ section for common questions
- Report bugs via GitHub Issues
- Join our community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- Firebase for the backend services
- D&D community for inspiration and feedback
- All contributors who help improve Waystone

## 🌟 Roadmap

### Upcoming Features
- [ ] Voice chat integration for live sessions
- [ ] Advanced dice rolling mechanics
- [ ] Campaign templates and starter modules
- [ ] Mobile app companion
- [ ] Integration with popular D&D tools (D&D Beyond, Roll20)
- [ ] Automated combat tracking and initiative system
- [ ] Rich text editor for campaign descriptions
- [ ] Image gallery for campaign assets

### Version History
- **v1.0.0** - Initial release with core campaign management
- **v1.1.0** - Added battle maps and real-time sessions
- **v1.2.0** - Enhanced character creation and management
- **v2.0.0** - Planned major update with advanced features

---

**Built with ❤️ for the D&D community**