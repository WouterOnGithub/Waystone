import { useState } from "react";
import { rollDie } from "../../services/diceRolls";
import "./diceRoller.css"

export default function DiceRoller() {
  const [sides, setSides] = useState(20);
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  const handleRoll = () => {
  const total = rollDie(sides, amount);
  setResult(total);
};

  return (
    <div className="dice-roller">
      <h4>Dice Roll</h4>

      <div className="dice-controls">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />

        <select value={sides} onChange={(e) => setSides(Number(e.target.value))}>
          <option value={4}>d4</option>
          <option value={6}>d6</option>
          <option value={8}>d8</option>
          <option value={10}>d10</option>
          <option value={12}>d12</option>
          <option value={20}>d20</option>
          <option value={100}>d100</option>
        </select>

        <button onClick={handleRoll}>Roll</button>
      </div>

      {result !== null && (
  <div className="dice-result">
    <b>Result: {result}</b>
  </div>
)}
    </div>
  );
}
