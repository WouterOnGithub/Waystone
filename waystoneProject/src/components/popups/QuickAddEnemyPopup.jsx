import React, { useState } from "react";
import { addEnemy } from "../../api/npcs";

export default function QuickAddEnemyPopup({isOpen, onClose, userId, campaignId}) {
    const [formData, setFormData] = useState({
        name:"",
        HpCurrent:"",
        HpMax:"",
        armorKlassen:""
    });

    if (!isOpen) return null

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]:value}))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !campaignId) {
            console.error("userId of campaignId is undefined!", { userId, campaignId });
            return;
        }

        const enemyData = {
            name: formData.name,
            HpCurrent: Number(formData.HpCurrent),
            HpMax: Number(formData.HpMax),
            armorKlassen: Number(formData.armorKlassen)
        };
        console.log("userId:", userId, "campaignId:", campaignId);
        await addEnemy(userId, campaignId, enemyData);
        console.log("userId:", userId, "campaignId:", campaignId);

        setFormData({
            name:"",
            HpCurrent:"",
            HpMax:"",
            armorKlassen:""
        });
    };

    return (
    <div className="popup-backdrop">
        <div className="popup-container">
            <h3>Quick Add Enemy</h3>

            <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="HpCurrent"
                placeholder="Current HP"
                value={formData.HpCurrent}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="HpMax"
                placeholder="Max HP"
                value={formData.HpMax}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="armorKlassen"
                placeholder="Armor Class"
                value={formData.armorKlassen}
                onChange={handleChange}
                required
            />

            <div className="popup-actions">
                <button type="button" onClick={onClose}>
                Cancel
                </button>

                <button type="submit">
                Create Enemy
                </button>
            </div>
            </form>
        </div>
    </div>
    );
}