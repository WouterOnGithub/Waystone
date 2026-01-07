import React, { useState , useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addNPC, getEntityById, updateEntity,deleteEntityAndSubCollections } from "../api/npcs";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { setDoc } from "firebase/firestore";
import "./pages-css/CSS.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import "./pages-css/Main_Page.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";

function Add_NPC() 
{
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

  const handleDeleteNPC = async () => {
    if (!npcId) return;
    if (!window.confirm("Are you sure you want to delete this NPC?")) return;

    try {
      const npcRef = doc(db, "Users", userId, "Campaigns", campaignId, "Entities", npcId);
      await deleteEntityAndSubCollections(npcRef);
      navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`);
    } catch (error) {
      console.error("Error deleting NPC:", error);
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
    <div className="full-page">
      
    <Sidebar />

    <div id="main">

      <Header title="New Campaign" />

        <div>
          
          {/* The buttons (campaign, mapbuilder, character)*/}
          <div id="campaign-tabs">

            {/* The campaign button */}
            <button id="campaign-tab">
              Campaign
            </button>

            {/* The map builder button */}
            <button id="campaign-tab">
              Map Builder
            </button>

            {/* The characters button */}
            <button id="campaign-tab-active">
              Characters
            </button>

          </div>

          {/* The NPC Sheet */}
          <div id="content">
          <div className="add-fullwidth">

            <h1>NPC Sheet</h1>
              
            {/* NPC Basics */}
            <div className="character-section">

              {/* The basic NPC info */}
              <div id="input-box-white" className="character-base-stats-section">

                <div className="character-base-stat">
                  <b>NPC Name</b>
                  <input type="text" 
                         value={characterData.name}
                         onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="character-base-stat">
                  <b>NPC Race</b>
                  <input type="text" 
                         value={characterData.race}
                         onChange={(e) => handleInputChange('race', e.target.value)}
                  />
                </div>

                <div className="character-base-stat">
                  <b>NPC SubClass</b>
                  <input type="text" 
                         value={characterData.subKlassen}
                         onChange={(e) => handleInputChange('subKlassen', e.target.value)}
                  />
                </div>

              </div>

            <div id="input-box-white" className="character-base-stats-section">

              <div className="character-base-stat">
                <b>NPC Class</b>
                <input type="text" 
                       value={characterData.klassen}
                       onChange={(e) => handleInputChange('klassen', e.target.value)}
                />
              </div>

              <div className="character-base-stat">
                <b>Background</b>
                <input type="text" 
                       value={characterData.background}
                       onChange={(e) => handleInputChange('background', e.target.value)}
                />
              </div>

                <div className="char-field">
                  <b>Level</b><br />
                  <input type="number" 
                         value={characterData.level}
                         onChange={(e) => handleNumberInputChange('level', e.target.value)}
                  />
                </div>

              </div>

              <div id="campaign-select">
                <b>Alignment</b><br />
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

            </div>

            {/* The ability scores */}
            <br />
            <h1>Ability Scores</h1>
            <div className="character-section">

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
                        {calculateModifier(characterData[ability]) >= 0 ? '+ ' : ''}
                        {calculateModifier(characterData[ability])}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* The combat statistics */}
            <br />
            <h1>Combat Statistics</h1>
            <div className="character-section">

              <div id="input-box-white" className="character-base-stats-section">

                <div className="character-base-stat">
                  <b>Armor Class</b>
                  <input type="number" 
                         value={characterData.armorKlassen}
                         onChange={(e) => handleNumberInputChange('armorKlassen', e.target.value)}
                  />
                </div>

                <div className="character-base-stat">
                  <b>Initiative</b>
                  <input type="number" 
                         value={characterData.initiative}
                         onChange={(e) => handleNumberInputChange('initiative', e.target.value)}
                  />
                </div>

                <div className="character-base-stat">
                  <b>Speed</b>
                  <input type="number" 
                         value={characterData.speed}
                         onChange={(e) => handleNumberInputChange('speed', e.target.value)}
                  />
                </div>

              </div>

              <div id="input-box-white" className="character-base-stats-section">

                <div className="character-base-stat">
                  <b>Hit Dice</b>
                  <input type="text" 
                         value={characterData.hitDice}
                         onChange={(e) => handleInputChange('hitDice', e.target.value)}
                         placeholder="1d8"
                  />
                </div>

                <div className="character-base-stat">
                  <b>Current HP</b>
                  <input type="number" 
                         value={characterData.HpCurrent}
                         onChange={(e) => handleNumberInputChange('HpCurrent',e.target.value)}
                  />
                </div>

                <div className="character-base-stat">
                  <label>Max HP</label>
                  <input type="number" 
                         value={characterData.HpMax}
                         onChange={(e) => handleNumberInputChange('HpMax', e.target.value)}
                  />
                </div>
              </div>

              <div id="combat-statistics-checkboxes">
                <b>Saving Throw Proficiencies</b><br />
                <label>
                  <input 
                    type="checkbox" 
                    value={characterData.savingThrows}
                    onChange={(e) => handleInputChange('savingThrows', e.target.value)}
                  />
                  &#10240;(placeholder)
                </label>
              </div>

            </div>

            {/* The skills */}
            <br />
            <h1>Skills</h1>
            <div id="input-box-white" className="character-section">

              <div>

                <div className="skill-row">
                  <span className="skill-label">Skill Bonus</span>
                  <span className="skill-label">Proficiency Modifier</span>
                </div>

                {Object.keys(characterData.skills).map((skill) => (
                  <div key={skill} className="skill-row">
                    
                    <div className="skill-bonus">{skillNames[skill]}: + {characterData.skills[skill]}</div>
                    
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

            {/* The class features */}
            <br />
            <h1>Class Features</h1>
            <div className="character-section">

              {characterData.classFeatures.map((feature, index) => (
                
                <div key={index} className="character-row">
                  <span>{feature.name}: {feature.bonus}</span>
                  <div>
                    <button id="button-gray">{feature.description + " "}ⓘ</button>
                    <button id="button-gray">delete</button>
                  </div>

                </div>

              ))}

            <button id="button-gray" onClick={() => addFeature('classFeatures')}>add feature</button>
          </div>

            {/* The background features */}
            <br />
            <h1>Background Features</h1>
            <div className="character-section">

                {characterData.backgroundFeatures.map((feature, index) => (
                  
                  <div key={index} className="character-row">
                    <span>{feature.name}: {feature.bonus}</span>
                    <div>
                      <button id="button-gray">{feature.description + " "}ⓘ</button>
                      <button id="button-gray">delete</button>
                    </div>

                  </div>

                ))}
                
              <button id="button-gray" onClick={() => addFeature('backgroundFeatures')}>add feature</button>
            </div>

            {/* The racial traits */}
            <br />
            <h1>Racial Traits</h1>
            <div id="input-box-white" className="character-section">
              
              <div>
                <b>Speed: {characterData.racialSpeed}</b><br />
                
                <textarea 
                  value={characterData.racialTraits}
                  onChange={(e) => handleInputChange('racialTraits', e.target.value)}
                  placeholder="Darkvision, Ability Boost, Attack Bonus"
                ></textarea>

              </div>
            </div>

            {/* The known spells */}
            <br />
            <h1>Known Spells</h1>
            <div className="character-section">

                {characterData.knownSpells.map((spell, index) => (

                  <div key={index} className="character-row">
                    <span>{spell.name}: {spell.level} lvl {spell.concentration ? '[ Concentration ]' : ''}</span>
                    <button id="button-gray">delete</button>
                  </div>

                ))}
                
              <button id="button-gray" onClick={addSpell}>Add Spell +</button>
            </div>

            {/* The personality & story */}
            <br />
            <h1>Personality & Story</h1>
            <div className="character-section">
              
              <div id="input-box-white">
                <b>Ideals</b>
                <br />
                <input type="text" 
                       value={characterData.ideals}
                       onChange={(e) => handleInputChange('ideals', e.target.value)}
                       placeholder="Bonds" 
                />
              </div>

              <br />

              <div id="input-box-white">
                <b>Backstory</b>
                <br />
                <textarea 
                  value={characterData.backstory}
                  onChange={(e) => handleInputChange('backstory', e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <br />

              <div id="input-box-white">
                <b>Notes</b>
                <br />
                <textarea 
                  value={characterData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="4"
                ></textarea>
              </div>

            </div>

            {/* The personal traits */}
            <br />
            <h1>Personal Traits</h1>
            <div className="character-section">

              <div>
                {characterData.personalTraits.map((trait, index) => (

                  <div key={index} className="character-row">
                    <span>{trait.name}: {trait.bonus}</span>
                    <button id="button-gray">delete</button>
                  </div>

                ))}
              </div>
              <button id="button-gray" onClick={addTrait}>add trait</button>
            </div>

            <div className="campaign-actions">
              <button id="button-green" onClick={handleSaveCharacter}>Save</button>
              <button id="button-gray" onClick={handleCancel}>Cancel</button>
              {npcId && (
                  <button id="button-gray" onClick={handleDeleteNPC}>Delete</button>
                )}
            </div>

          </div>

        </div>

        <Footer />

        </div>
      </div>
      </div>
  );
}

export default Add_NPC;