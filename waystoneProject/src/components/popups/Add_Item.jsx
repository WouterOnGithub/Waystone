import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import Add_Logo from "../../assets/Add_Logo.webp";
import { createItem, updateItem } from "../../api/userCampaigns";
import { useAuth } from "../../context/AuthContext";

function Add_Item({onClose, campaignId, item}) 
{
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [effects, setEffects] = useState(item?.effects || []);
  const [bonusEffects, setBonusEffects] = useState(item?.bonusEffects || []);
  const [value, setValue] = useState(item?.value?.toString() || "");
  const [weight, setWeight] = useState(item?.weight?.toString() || "");
  const [newEffect, setNewEffect] = useState("");
  const [newBonusEffect, setNewBonusEffect] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const handleAddEffect = () => {
    if (newEffect.trim() && effects.length < 10) {
      setEffects([...effects, newEffect.trim()]);
      setNewEffect("");
    }
  };

  const handleAddBonusEffect = () => {
    if (newBonusEffect.trim() && bonusEffects.length < 10) {
      setBonusEffects([...bonusEffects, newBonusEffect.trim()]);
      setNewBonusEffect("");
    }
  };

  const handleRemoveEffect = (index) => {
    setEffects(effects.filter((_, i) => i !== index));
  };

  const handleRemoveBonusEffect = (index) => {
    setBonusEffects(bonusEffects.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      setMessage("You must be signed in to save an item.");
      return;
    }
    
    if (!campaignId) {
      setMessage("No campaign selected for this item.");
      return;
    }
    
    if (!name.trim()) {
      setMessage("Please enter a name for this item.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const itemData = {
        name: name.trim(),
        description: description.trim(),
        effects: effects,
        bonusEffects: bonusEffects,
        value: parseFloat(value) || 0,
        weight: parseFloat(weight) || 0,
        lastUpdatedAt: new Date().toISOString(),
      };

      let saved;
      if (item?.id) {
        // Update existing item
        saved = await updateItem(userId, campaignId, item.id, itemData);
        setMessage("Item updated successfully.");
      } else {
        // Create new item
        const dataWithCreated = {
          ...itemData,
          createdAt: new Date().toISOString(),
        };
        saved = await createItem(userId, campaignId, dataWithCreated);
        setMessage("Item saved successfully.");
      }
      
      if (!saved) {
        throw new Error("Failed to save item.");
      }

      setMessage("Item saved successfully.");
      
      // Reset form only for new items
      if (!item?.id) {
        setName("");
        setDescription("");
        setEffects([]);
        setBonusEffects([]);
        setValue("");
        setWeight("");
        setNewEffect("");
        setNewBonusEffect("");
      }
      
      // Close popup after successful save
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
      
    } catch (err) {
      setMessage(err?.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">{item?.id ? "Edit Item" : "Add Item"}</p>

      <div id="addview-content">

        <form id="input-box-gray" onSubmit={handleSave}>
            <br />
            <label htmlFor="name-item"><b>Name</b></label> <br />
            <input type="text" id="name-item" value={name} onChange={(e) => setName(e.target.value)} /> 
            <br /><br />
            
            <div id="addview-discription">
                <label htmlFor="discription-item"><b>Short Discription</b> (max. 80 characters)</label> <br />
                <textarea name="discription-item" id="discription-item" value={description} onChange={(e) => setDescription(e.target.value)} maxlength="80"></textarea>
            </div>
            <br />

            {/* Value and Weight */}
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                <div style={{flex: 1}}>
                    <label htmlFor="value-item"><b>Value</b></label> <br />
                    <input type="number" id="value-item" value={value} onChange={(e) => setValue(e.target.value)} step="0.01" min="0" placeholder="0.00" />
                </div>
                <div style={{flex: 1}}>
                    <label htmlFor="weight-item"><b>Weight</b></label> <br />
                    <input type="number" id="weight-item" value={weight} onChange={(e) => setWeight(e.target.value)} step="0.1" min="0" placeholder="0.0" />
                </div>
            </div>

            {/* A way to add an effect by pressing the ADD icon */}
            <label htmlFor="effects-item"><b>Effects</b></label> 
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                <input 
                    type="text" 
                    id="effects-item" 
                    value={newEffect}
                    onChange={(e) => setNewEffect(e.target.value)}
                    placeholder="Enter effect name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddEffect()}
                />
                <button id="button-icons" type="button" onClick={handleAddEffect}>
                    <img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/>
                </button>
            </div>
            
            {/* Display effects */}
            {effects.length > 0 && (
                <div className="character-section addview">
                    {effects.map((effect, index) => (
                        <div className="character-row addview" key={index}>
                            <b>{effect}</b> 
                            <button id="button-gray" type="button" onClick={() => handleRemoveEffect(index)}>delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* A way to add a bonus effect by pressing the ADD icon */}
            <label htmlFor="effects-bonus-item"><b>Bonus-effects</b></label>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px'}}>
                <input 
                    type="text" 
                    id="effects-bonus-item" 
                    value={newBonusEffect}
                    onChange={(e) => setNewBonusEffect(e.target.value)}
                    placeholder="Enter bonus effect name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddBonusEffect()}
                />
                <button id="button-icons" type="button" onClick={handleAddBonusEffect}>
                    <img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/>
                </button>
            </div>
            
            {/* Display bonus effects */}
            {bonusEffects.length > 0 && (
                <div className="character-section addview">
                    {bonusEffects.map((effect, index) => (
                        <div className="character-row addview" key={index}>
                            <b>{effect}</b> 
                            <button id="button-gray" type="button" onClick={() => handleRemoveBonusEffect(index)}>delete</button>
                        </div>
                    ))}
                </div>
            )}

              <button id="button-green" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button id="button-green" type="button" onClick={onClose}>Back</button>
              {message && (
                <>
                  <br />
                  <p>{message}</p>
                </>
              )}
              
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Item;