import React, { useRef, useState } from "react";
import { addEnemy } from "../../api/npcs";
import "./QuickAddEnemyPopup.css";

export default function QuickAddEnemyPopup({isOpen, onClose, userId, campaignId}) {
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("/assets/placeholderImage.jpg")
    const fileInputRef = useRef(null)

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

        const current = Number(formData.HpCurrent);
        const max = Number(formData.HpMax);

        if (current > max) {
            alert("Current HP cannot be higher than Max HP");
            return;
        }
        
        let imageUrl ="";

        if (imageFile) {
            const uploadData = new FormData();
            uploadData.append("campaignId", campaignId);
            console.log("QuickAddEnemyPopup campaignId:", campaignId);
            uploadData.append("image", imageFile);

            const res = await fetch("/api/upload-entity", {
                method: "POST",
                body: uploadData,
            });

            if (!res.ok) throw new Error("Image upload failed");

            const result = await res.json();
            imageUrl = result.url; // url in public/entities
        }

        const enemyData = {
            name: formData.name,
            HpCurrent: Number(formData.HpCurrent),
            HpMax: Number(formData.HpMax),
            armorKlassen: Number(formData.armorKlassen),
            imageUrl,
        };
        await addEnemy(userId, campaignId, enemyData);
        try{
            setFormData({
                name:"",
                HpCurrent:"",
                HpMax:"",
                armorKlassen:""
            });
            setImageFile(null);
            setImagePreview("/assets/placeholderImage.jpg");

            onClose();
        }catch{
            console.error("error creating enemy", error);
        }
        
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

            <div className="image-upload-area">
                <img
                    src={imagePreview}
                    alt="Enemy"
                    style={{ width: 100, height: 100, objectFit: "cover", cursor: "pointer" }}
                    onClick={() => fileInputRef.current?.click()}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                    }}
                    hidden
                    accept="image/*"
                />
            </div>

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