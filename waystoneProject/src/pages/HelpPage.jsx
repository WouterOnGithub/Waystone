import { useState } from 'react';
import { Link } from 'react-router-dom';
import "./pages-css/CSS.css";
import './pages-css/HelpPage.css';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import Sidebar from '../components/UI/Sidebar';

function HelpPage() 
{
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
    <div>

      <Sidebar />

      <div id="main">

        <Header title="Help & Support" />
        
        <div id="content">

          <div className="help-intro">

            <b>How can we help you ?</b>
            <p>Find answers to your questions and learn how to make the most of your Waystone experience</p>

            <div className="search-box">
              <input type="text" placeholder="Search for help articles ..." className="help-search"/>
              <button id="button-gray">Search</button>
            </div>
            
          </div>

          <div className="help-content-wrapper">

            {/* The categories - left sidebar */}
            <div className="help-sidebar">
              
              <b>Categories</b>

              <nav className="category-nav">
                {categories.map(category => (
                  <button key={category.id}
                          className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                          onClick={() => setActiveCategory(category.id)}
                  >
                  
                  {/* The category icon and title */}
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  </button>
                ))}
              </nav>

              <div className="help-cta">
                <b>Still need help ?</b>
                <div>&#10240;</div> {/* To create space between the b and button */}
                <Link to="/contact" id="button-gray">Contact Support</Link>
              </div>
            </div>

            {/* The category articles in the right-side section */}
            <div className="help-articles">

              <b className="category-title">{helpContent[activeCategory].title}</b>
              
              {helpContent[activeCategory].sections.map((section, index) => (
                
                <div key={index} className="help-article">
                  <b>{section.title}</b>
                  <p>{section.content}</p>
                </div>

              ))}

              {/* Quick tips under the category content */}
              <div className="quick-tips">
                
                <b> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="var(--text-color3)"><path d="M420.9 448C428.2 425.7 442.8 405.5 459.3 388.1C492 353.7 512 307.2 512 256C512 150 426 64 320 64C214 64 128 150 128 256C128 307.2 148 353.7 180.7 388.1C197.2 405.5 211.9 425.7 219.1 448L420.8 448zM416 496L224 496L224 512C224 556.2 259.8 592 304 592L336 592C380.2 592 416 556.2 416 512L416 496zM312 176C272.2 176 240 208.2 240 248C240 261.3 229.3 272 216 272C202.7 272 192 261.3 192 248C192 181.7 245.7 128 312 128C325.3 128 336 138.7 336 152C336 165.3 325.3 176 312 176z"/></svg>
                  Quick Tips</b>
                

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

            <b>Frequently Asked Questions</b>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                
                <div key={index} className="faq-item">
                  <button 
                    className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>&#11208; {faq.question}</span>
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

            <b className="tutorials-section-title">Video Tutorials</b>

            <div className="tutorial-grid">

              <div className="tutorial-card">
                <div className="tutorial-thumbnail" id="tutorial-thumbnail-colour1">▶</div>
                <b>Getting Started</b>
                <p>Learn the basics of Waystone in 5 minutes</p>
              </div>

              <div className="tutorial-card">
                <div className="tutorial-thumbnail" id="tutorial-thumbnail-colour2">▶</div>
                <b>Running Your First Session</b>
                <p>A complete walkthrough for DMs</p>
              </div>

              <div className="tutorial-card">
                <div className="tutorial-thumbnail" id="tutorial-thumbnail-colour3">▶</div>
                <b>Advanced Combat</b>
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