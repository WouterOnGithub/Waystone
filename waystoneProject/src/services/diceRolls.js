export function rollDie (sides, amount){
    const results = [];
    for(let i = 0; i<amount; i++){
        const roll = Math.floor(Math.random() * sides) + 1;
        results.push(roll);
    }
    const total = results.reduce((a, b) => a + b, 0)
    return total
}