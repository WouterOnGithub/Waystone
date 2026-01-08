import React, { useState, useEffect } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import Add_Logo from "../../assets/Add_Logo.webp";
import { useAuth } from "../../context/AuthContext";
import { getItems, createContainer, updateContainer } from "../../api/userCampaigns";

function Add_Container({onClose, campaignId, container, onContainerSaved}) 
{
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [name, setName] = useState(container?.name || "");
  const [selectedItems, setSelectedItems] = useState(container?.items || []);
  const [newItem, setNewItem] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing items when component mounts
  useEffect(() => {
    const loadItems = async () => {
      if (!userId || !campaignId) return;
      try {
        const itemList = await getItems(userId, campaignId);
        setAllItems(itemList || []);
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    };
    loadItems();
  }, [userId, campaignId]);

  const handleAddItem = () => {
    if (newItem.trim() && selectedItems.length < 10) {
      setSelectedItems([...selectedItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Save clicked, container:", container);
    
    if (!name.trim()) {
      setMessage("Please enter a name for this container.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("Please add at least one item to this container.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const containerData = {
        name: name.trim(),
        items: selectedItems,
        lastUpdatedAt: new Date().toISOString(),
      };

      console.log("Container data to save:", containerData);
      console.log("Current selectedItems:", selectedItems);

      let saved;
      if (container?.id) {
        // Update existing container
        console.log("Updating existing container:", container.id);
        console.log("Original container items:", container.items);
        containerData.createdAt = container.createdAt;
        saved = await updateContainer(userId, campaignId, container.id, containerData);
        setMessage("Container updated successfully!");
      } else {
        // Create new container
        console.log("Creating new container");
        containerData.createdAt = new Date().toISOString();
        saved = await createContainer(userId, campaignId, containerData);
        setMessage("Container created successfully!");
      }
      
      console.log("Save result:", saved);
      
      if (!saved) {
        throw new Error("Failed to save container.");
      }

      // Call the callback to refresh containers in parent component
      if (onContainerSaved) {
        onContainerSaved();
      }

      // Don't reset form or close popup for edits - only for new containers
      if (!container?.id) {
        setName("");
        setSelectedItems([]);
        setNewItem("");
      }
      
    } catch (err) {
      console.error("Save error:", err);
      setMessage(err?.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Container</p>

      <div id="addview-content">

        <form id="input-box-white" onSubmit={handleSave}>
            <br />
            <label htmlFor="name-buildingregion"><b>Container Name</b></label> <br />
            <input 
              type="text" 
              id="name-buildingregion"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter container name"
            /> 
            <br /><br />

            {/* Add items to container */}
            <label htmlFor="container-items"><b>Items in Container</b></label> 
            <div className="addview-select">
              <select 
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              >
                <option value="">Select an item...</option>
                {allItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name || 'Unnamed Item'}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                id="button-icons" 
                onClick={handleAddItem}
                disabled={!newItem}
              >
                <img src={Add_Logo} alt="Add_Logo" id="Add_Logo"/>
              </button>
            </div>
            
            {/* Display selected items */}
            {selectedItems.length > 0 && (
              <div className="character-section addview">
                {selectedItems.map((itemId, index) => {
                  const item = allItems.find(i => i.id === itemId);
                  return (
                    <div className="character-row addview" key={index}>
                      <b>{item?.name || 'Unknown Item'}</b> 
                      <button 
                        type="button" 
                        id="button-gray" 
                        onClick={() => handleRemoveItem(index)}
                      >
                        remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <br />

              <button id="button-green" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button id="button-gray" type="button" onClick={onClose}>Back</button>
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

export default Add_Container;