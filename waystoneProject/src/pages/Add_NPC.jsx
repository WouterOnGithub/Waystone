import React, { useState , useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

import { addNPC, getEntityById, updateEntity } from "../api/npcs";
import { useAuth } from "../context/AuthContext";
import { setDoc } from "firebase/firestore";

function Add_NPC() {
  const { user } = useAuth();
  const userId = user ? user.uid : null;
  const { campaignId, npcId } = useParams();
  const navigate = useNavigate();

  const handleSaveCharacter = async ()=>{
  if (!userId || !campaignId) return

    try {
      if(npcId){
        await updateEntity(userId, campaignId, npcId, characterData)
        console.log("Npc uppdated succesfully");
      }else{
        const newNPC = await addNPC(userId, campaignId, characterData);
        console.log("npc saved", newNPC);
      }
    
      navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`);
    }catch(error){
      console.error("Error saving NPC", error);
    }
  };

  const handleCancel = () =>{
    if(!campaignId) return;
    navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`);
  };

  const [characterData, setCharacterData] = useState({
    name: "",
    race: "",
    klassen: "",
    subKlassen: "",
    background: "",
    alignment: "",
    level: 1,
    
    // Ability Scores
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    
    // Combat Statistics
    armorKlassen: 10,
    initiative: 0,
    speed: 30,
    hitDice: "1d8",
    HpCurrent: 10,
    HpMax: 10,
    savingThrows: "",
    
    // Skills
    skills: {
      acrobatics: 0,
      animalHandling: 0,
      arcana: 0,
      athletics: 0,
      deception: 0,
      history: 0,
      insight: 0,
      intimidation: 0,
      investigation: 0,
      medicine: 0,
      nature: 0,
      perception: 0,
      performance: 0,
      persuasion: 0,
      religion: 0,
      sleightOfHand: 0,
      stealth: 0,
      survival: 0
    },
    
    // Features
    classFeatures: [
      { name: "Feature", bonus: "+3", description: "" },
      { name: "Feature", bonus: "+2", description: "Long description" }
    ],
    backgroundFeatures: [
      { name: "Feature", bonus: "+2", description: "" },
      { name: "Feature", bonus: "+2", description: "Long description" }
    ],
    racialTraits: "Darkvision, Ability Boost, Attack Bonus",
    racialSpeed: "+4",
    
    // Spells
    knownSpells: [
      { name: "Spell", level: "1st", concentration: true },
      { name: "Spell", level: "2nd", concentration: true }
    ],
    
    // Personality & Story
    ideals: "",
    bonds: "",
    backstory: "",
    notes: "",
    
    // Personal Traits
    personalTraits: [
      { name: "Trait", bonus: "+1" },
      { name: "Trait", bonus: "+2" },
      { name: "Trait", bonus: "+4" },
      { name: "Trait", bonus: "+4" },
      { name: "Item", bonus: "+3" }
    ]
  });
  
  useEffect(()=>{
    if(npcId){
      const fetchNPC = async() => {
        try{
          const existingNPC = await getEntityById(userId,campaignId, npcId);
          setCharacterData(prev => ({...prev, ...existingNPC}));
        }catch(err){
          console.log('Error fetching npc')
        } 
      };
      fetchNPC();
    }
  }, [npcId, campaignId]);

  const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };
  
  const handleInputChange = (field, value)=>{
    setCharacterData(prev => ({ ...prev, [field]: value }));
  }

  const handleNumberInputChange = (field, value) => {
    const number = parseInt(value);
    if(isNaN(number)){
      alert(`${field} moet een geldig getal zijn`);
      return;
    }
    setCharacterData(prev => ({ ...prev, [field]: number }));
  };

  const handleSkillChange = (skill, value) => {
    setCharacterData({
      ...characterData,
      skills: { ...characterData.skills, [skill]: parseInt(value) || 0 }
    });
  };

  const addFeature = (listName) => {
    setCharacterData({
      ...characterData,
      [listName]: [...characterData[listName], { name: "Feature", bonus: "+0", description: "" }]
    });
  };

  const addSpell = () => {
    setCharacterData({
      ...characterData,
      knownSpells: [...characterData.knownSpells, { name: "Spell", level: "1st", concentration: false }]
    });
  };

  const addTrait = () => {
    setCharacterData({
      ...characterData,
      personalTraits: [...characterData.personalTraits, { name: "Trait", bonus: "+0" }]
    });
  };

  const skillNames = {
    acrobatics: "Acrobatics",
    animalHandling: "Animal Handling",
    arcana: "Arcana",
    athletics: "Athletics",
    deception: "Deception",
    history: "History",
    insight: "Insight",
    intimidation: "Intimidation",
    investigation: "Investigation",
    medicine: "Medicine",
    nature: "Nature",
    perception: "Perception",
    performance: "Performance",
    persuasion: "Persuasion",
    religion: "Religion",
    sleightOfHand: "Sleight of Hand",
    stealth: "Stealth",
    survival: "Survival"
  };

  return (
    <div className="campaign-page">
      <Sidebar />
      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button className="campaign-tab">Campaign</button>
            <button className="campaign-tab">Map Builder</button>
            <button className="campaign-tab active">Characters</button>
          </div>

          <div className="character-sheet">
            {/* Character Basics */}
            <div className="char-section">
              <h3 className="char-section-title">Character Sheet</h3>
              
              <div className="char-grid-3">
                <div className="char-field">
                  <label>Character Name</label>
                  <input 
                    type="text" 
                    value={characterData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="char-field">
                  <label>Character Race</label>
                  <input 
                    type="text" 
                    value={characterData.race}
                    onChange={(e) => handleInputChange('race', e.target.value)}
                  />
                </div>
                <div className="char-field">
                  <label>Character SubClass</label>
                  <input 
                    type="text" 
                    value={characterData.subKlassen}
                    onChange={(e) => handleInputChange('subKlassen', e.target.value)}
                  />
                </div>
              </div>

              <div className="char-grid-3">
                <div className="char-field">
                  <label>Character Class</label>
                  <input 
                    type="text" 
                    value={characterData.klassen}
                    onChange={(e) => handleInputChange('klassen', e.target.value)}
                  />
                </div>
                <div className="char-field">
                  <label>Background</label>
                  <input 
                    type="text" 
                    value={characterData.background}
                    onChange={(e) => handleInputChange('background', e.target.value)}
                  />
                </div>
                <div className="char-field">
                  <label>Alignment</label>
                  <select 
                    value={characterData.alignment}
                    onChange={(e) => handleInputChange('alignment', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Lawful Good">Lawful Good</option>
                    <option value="Neutral Good">Neutral Good</option>
                    <option value="Chaotic Good">Chaotic Good</option>
                    <option value="Lawful Neutral">Lawful Neutral</option>
                    <option value="True Neutral">True Neutral</option>
                    <option value="Chaotic Neutral">Chaotic Neutral</option>
                    <option value="Lawful Evil">Lawful Evil</option>
                    <option value="Neutral Evil">Neutral Evil</option>
                    <option value="Chaotic Evil">Chaotic Evil</option>
                  </select>
                </div>
                <div className="char-field">
                  <label>Level</label>
                  <input 
                    type="number" 
                    value={characterData.level}
                    onChange={(e) => handleNumberInputChange('level', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Ability Scores */}
            <div className="char-section">
              <h3 className="char-section-title">Ability Scores</h3>
              <div className="ability-grid">
                {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => (
                  <div key={ability} className="ability-box">
                    <div className="ability-name">{ability.charAt(0).toUpperCase() + ability.slice(1)} + Modifier</div>
                    <div className="ability-inputs">
                      <input 
                        type="number" 
                        value={characterData[ability]}
                        onChange={(e) => handleNumberInputChange(ability, e.target.value) || 10 }
                        className="ability-score"
                      />
                      <div className="ability-modifier">
                        {calculateModifier(characterData[ability]) >= 0 ? '+' : ''}
                        {calculateModifier(characterData[ability])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Combat Statistics */}
            <div className="char-section">
              <h3 className="char-section-title">Combat Statistics</h3>
              <div className="combat-grid">
                <div className="combat-stat">
                  <label>Armor Class</label>
                  <input 
                    type="number" 
                    value={characterData.armorKlassen}
                    onChange={(e) => handleNumberInputChange('armorKlassen', e.target.value)}
                  />
                </div>
                <div className="combat-stat">
                  <label>Initiative</label>
                  <input 
                    type="number" 
                    value={characterData.initiative}
                    onChange={(e) => handleNumberInputChange('initiative', e.target.value)}
                  />
                </div>
                <div className="combat-stat">
                  <label>Speed</label>
                  <input 
                    type="number" 
                    value={characterData.speed}
                    onChange={(e) => handleNumberInputChange('speed', e.target.value)}
                  />
                </div>
                <div className="combat-stat">
                  <label>Hit Dice</label>
                  <input 
                    type="text" 
                    value={characterData.hitDice}
                    onChange={(e) => handleInputChange('hitDice', e.target.value)}
                    placeholder="1d8"
                  />
                </div>
                <div className="combat-stat">
                  <label>Current HP</label>
                  <input 
                    type="number" 
                    value={characterData.HpCurrent}
                    onChange={(e) => handleNumberInputChange('HpCurrent',e.target.value)}
                  />
                </div>
                <div className="combat-stat">
                  <label>Max HP</label>
                  <input 
                    type="number" 
                    value={characterData.HpMax}
                    onChange={(e) => handleNumberInputChange('HpMax', e.target.value)}
                  />
                </div>
              </div>
              <div className="char-field">
                <label>Saving Throw Proficiencies</label>
                <input 
                  type="text" 
                  value={characterData.savingThrows}
                  onChange={(e) => handleInputChange('savingThrows', e.target.value)}
                  placeholder="e.g., Strength, Constitution" 
                />
              </div>
            </div>

            {/* Skills */}
            <div className="char-section">
              <h3 className="char-section-title">Skills</h3>
              <div className="skills-grid">
                <div className="skill-row">
                  <span className="skill-label">Skill Bonus</span>
                  <span className="skill-label">Proficiency Modifier</span>
                </div>
                {Object.keys(characterData.skills).map((skill) => (
                  <div key={skill} className="skill-row">
                    <div className="skill-bonus">{skillNames[skill]}: +{characterData.skills[skill]}</div>
                    <select 
                      value={characterData.skills[skill]}
                      onChange={(e) => handleSkillChange(skill, e.target.value)}
                      className="skill-select"
                    >
                      <option value="0">Not Proficient</option>
                      <option value="2">Proficient (+2)</option>
                      <option value="4">Expert (+4)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Features */}
            <div className="char-section">
              <h3 className="char-section-title">Class Features ⓘ</h3>
              <div className="feature-list">
                {characterData.classFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span>{feature.name}: {feature.bonus}</span>
                    <button className="feature-info">ⓘ {feature.description}</button>
                  </div>
                ))}
              </div>
              <button className="add-feature-btn" onClick={() => addFeature('classFeatures')}>Add Feature +</button>
            </div>

            {/* Background Features */}
            <div className="char-section">
              <h3 className="char-section-title">Background Features ⓘ</h3>
              <div className="feature-list">
                {characterData.backgroundFeatures.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span>{feature.name}: {feature.bonus}</span>
                    <button className="feature-info">ⓘ {feature.description}</button>
                  </div>
                ))}
              </div>
              <button className="add-feature-btn" onClick={() => addFeature('backgroundFeatures')}>Add Feature +</button>
            </div>

            {/* Racial Traits */}
            <div className="char-section">
              <h3 className="char-section-title">Racial Traits ⓘ</h3>
              <div className="char-field">
                <label>Speed: {characterData.racialSpeed}</label>
                <textarea 
                  value={characterData.racialTraits}
                  onChange={(e) => handleInputChange('racialTraits', e.target.value)}
                  placeholder="Darkvision, Ability Boost, Attack Bonus"
                ></textarea>
              </div>
            </div>

            {/* Known Spells */}
            <div className="char-section">
              <h3 className="char-section-title">Known Spells ⓘ</h3>
              <div className="spell-list">
                {characterData.knownSpells.map((spell, index) => (
                  <div key={index} className="spell-item">
                    {spell.name}: {spell.level} Level {spell.concentration ? '[ Concentration ]' : ''}
                  </div>
                ))}
              </div>
              <button className="add-feature-btn" onClick={addSpell}>Add Spell +</button>
            </div>

            {/* Personality & Story */}
            <div className="char-section">
              <h3 className="char-section-title">Personality & Story</h3>
              <div className="char-field">
                <label>Ideals</label>
                <input 
                  type="text" 
                  value={characterData.ideals}
                  onChange={(e) => handleInputChange('ideals', e.target.value)}
                  placeholder="Bonds" 
                />
              </div>
              <div className="char-field">
                <label>Backstory</label>
                <textarea 
                  value={characterData.backstory}
                  onChange={(e) => handleInputChange('backstory', e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="char-field">
                <label>Notes</label>
                <textarea 
                  value={characterData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* Personal Traits */}
            <div className="char-section">
              <h3 className="char-section-title">Personal Traits ⓘ</h3>
              <div className="traits-grid">
                {characterData.personalTraits.map((trait, index) => (
                  <div key={index} className="trait-box">
                    {trait.name}: {trait.bonus}
                  </div>
                ))}
              </div>
              <button className="add-feature-btn" onClick={addTrait}>Add Trait +</button>
            </div>

            {/* Action Buttons */}
            <div className="char-actions">
              <button className="char-save-btn" onClick={handleSaveCharacter}>Save Character</button>
              <button className="char-cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Add_NPC;