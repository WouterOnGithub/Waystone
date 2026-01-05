import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import Sidebar from '../components/UI/Sidebar';
import './pages-css/HelpPage.css';

function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: '🎲' },
    { id: 'campaigns', label: 'Campaign Management', icon: '📚' },
    { id: 'gameplay', label: 'Gameplay Mechanics', icon: '⚔️' },
    { id: 'characters', label: 'Character Creation', icon: '🧙' },
    { id: 'combat', label: 'Combat & Encounters', icon: '🗡️' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' },
  ];

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with Waystone',
      sections: [
        {
          title: 'Welcome to Waystone',
          content: 'Waystone is your ultimate companion for creating and managing epic D&D campaigns online. Whether you\'re a seasoned Dungeon Master or a first-time player, our platform provides all the tools you need for an immersive tabletop experience.'
        },
        {
          title: 'Creating Your First Campaign',
          content: 'Navigate to the "New Campaign" page to begin your adventure. Give your campaign a memorable name, set the world parameters, and invite your players. You can customize everything from the campaign setting to house rules.'
        },
        {
          title: 'Inviting Players',
          content: 'Share your campaign code with players to let them join. Players can create their characters and will have access to all campaign materials you share with them. You control what information is visible to each player.'
        }
      ]
    },
    'campaigns': {
      title: 'Campaign Management',
      sections: [
        {
          title: 'Organizing Your Campaign',
          content: 'Use folders and tags to organize your campaign materials. Create separate sections for NPCs, locations, plot hooks, and session notes. The search function helps you quickly find any element during gameplay.'
        },
        {
          title: 'Session Planning',
          content: 'Prepare your sessions by creating encounter templates, NPC stat blocks, and location descriptions. You can schedule sessions and send notifications to all players automatically.'
        },
        {
          title: 'Campaign Archives',
          content: 'Completed campaigns can be archived but remain accessible for reference. You can export campaign data or create templates for future adventures based on successful campaigns.'
        }
      ]
    },
    'gameplay': {
      title: 'Gameplay Mechanics',
      sections: [
        {
          title: 'Virtual Tabletop Features',
          content: 'Our platform includes an interactive map system where you can place tokens, draw paths, and reveal fog of war. Players can move their tokens, and the DM has full control over the battlefield layout.'
        },
        {
          title: 'Dice Rolling System',
          content: 'Use the integrated dice roller for all checks, saves, and damage rolls. Results are logged in the game history and visible to all players. You can create custom dice macros for frequently used rolls.'
        },
        {
          title: 'Initiative Tracker',
          content: 'The automatic initiative tracker keeps combat flowing smoothly. It tracks turn order, conditions, and durations. Players receive notifications when their turn begins.'
        }
      ]
    },
    'characters': {
      title: 'Character Creation',
      sections: [
        {
          title: 'Building Your Character',
          content: 'Follow the step-by-step character creation wizard to build your hero. Choose your race, class, background, and abilities. The system automatically calculates all modifiers and provides guidance on character optimization.'
        },
        {
          title: 'Character Sheets',
          content: 'Digital character sheets update automatically as you level up or acquire new items. Track your hit points, spell slots, and resources in real-time. All changes are saved instantly.'
        },
        {
          title: 'Equipment & Inventory',
          content: 'Manage your character\'s equipment and inventory with drag-and-drop functionality. The system tracks encumbrance, attunement, and item properties automatically.'
        }
      ]
    },
    'combat': {
      title: 'Combat & Encounters',
      sections: [
        {
          title: 'Running Combat',
          content: 'The combat interface provides quick access to monster stat blocks, player abilities, and environmental effects. Use the action economy tracker to ensure balanced encounters.'
        },
        {
          title: 'Conditions & Effects',
          content: 'Apply conditions like stunned, prone, or invisible with a single click. The system tracks duration and reminds you when effects expire. Hover over any condition for a quick reference.'
        },
        {
          title: 'Encounter Builder',
          content: 'Use the encounter builder to create balanced fights. The system calculates difficulty based on party composition and suggests adjustments to match your desired challenge level.'
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      sections: [
        {
          title: 'Connection Issues',
          content: 'If you experience lag or disconnections, check your internet connection and refresh the page. The system auto-saves your progress every 30 seconds, so you won\'t lose work.'
        },
        {
          title: 'Browser Compatibility',
          content: 'Waystone works best on the latest versions of Chrome, Firefox, Safari, and Edge. Disable browser extensions if you encounter display issues. Clear your cache if elements don\'t load properly.'
        },
        {
          title: 'Data Recovery',
          content: 'All campaign data is backed up daily. If you accidentally delete something, contact support within 30 days for recovery assistance. Use the export feature to create local backups of important campaigns.'
        }
      ]
    }
  };

  const faqs = [
    {
      question: 'How many players can join a campaign?',
      answer: 'A campaign can support up to 8 players plus the Dungeon Master. For larger groups, consider splitting into multiple campaigns or using the observer role for additional participants.'
    },
    {
      question: 'Can I use homebrew content?',
      answer: 'Yes! Waystone fully supports custom races, classes, spells, and items. Use the content creator tools to design and balance your homebrew material. You can share homebrew content with other users or keep it private.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently, Waystone is web-based and optimized for tablets and desktop browsers. A dedicated mobile app is in development and will be released in the coming months.'
    },
    {
      question: 'How do I import existing character sheets?',
      answer: 'Use the import wizard in the character creation menu. Waystone accepts PDF character sheets and data from popular character builder tools. The system will attempt to auto-fill fields, which you can then verify and adjust.'
    },
    {
      question: 'What happens if the DM disconnects during a session?',
      answer: 'The session will pause automatically. Players can still chat and view their character sheets. Once the DM reconnects, gameplay resumes from the last auto-saved state. Consider designating a co-DM for important sessions.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Help & Support" />
        
        <div className="help-page">
          <div className="help-intro">
            <h2>How can we help you?</h2>
            <p>Find answers to common questions and learn how to make the most of Waystone</p>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search for help articles..."
                className="help-search"
              />
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="help-content-wrapper">
            {/* Category Navigation */}
            <div className="help-sidebar">
              <h3>Categories</h3>
              <nav className="category-nav">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-label">{category.label}</span>
                  </button>
                ))}
              </nav>

              <div className="help-cta">
                <h4>Still need help?</h4>
                <p>Can't find what you're looking for?</p>
                <Link to="/contact" className="contact-button">Contact Support</Link>
              </div>
            </div>

            {/* Help Articles */}
            <div className="help-articles">
              <h2 className="category-title">{helpContent[activeCategory].title}</h2>
              
              {helpContent[activeCategory].sections.map((section, index) => (
                <div key={index} className="help-article">
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}

              {/* Quick Tips */}
              <div className="quick-tips">
                <h3>💡 Quick Tips</h3>
                <ul>
                  <li>Use keyboard shortcuts: Press '?' to view all available shortcuts</li>
                  <li>Right-click on any element for context-specific actions</li>
                  <li>Enable auto-save notifications in settings for peace of mind</li>
                  <li>Create templates for frequently used NPCs and encounters</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button 
                    className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{openFAQ === index ? '−' : '+'}</span>
                  </button>
                  {openFAQ === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials Section */}
          <div className="tutorials-section">
            <h2>Video Tutorials</h2>
            <div className="tutorial-grid">
              <div className="tutorial-card">
                <div className="tutorial-thumbnail">▶️</div>
                <h4>Getting Started</h4>
                <p>Learn the basics of Waystone in 5 minutes</p>
              </div>
              <div className="tutorial-card">
                <div className="tutorial-thumbnail">▶️</div>
                <h4>Running Your First Session</h4>
                <p>A complete walkthrough for DMs</p>
              </div>
              <div className="tutorial-card">
                <div className="tutorial-thumbnail">▶️</div>
                <h4>Advanced Combat</h4>
                <p>Master the combat encounter system</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default HelpPage;