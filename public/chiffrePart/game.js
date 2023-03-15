function generateNumberGame() {
    // Generate six random numbers between 1 and 100
    const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 1);
    console.log("The numbers are:", numbers);
  
    // Generate a target number between 100 and 999
    const target = Math.floor(Math.random() * 900) + 100;
    console.log("The target is:", target);
  
    // Find the closest possible target number using the four basic arithmetic operations
    let closest = Infinity;
    let expression = "";
  
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        if (i !== j) {
          const result1 = numbers[i] + numbers[j];
          const expr1 = `(${numbers[i]}+${numbers[j]})`;
          updateClosest(result1, expr1);
  
          const result2 = numbers[i] - numbers[j];
          const expr2 = `(${numbers[i]}-${numbers[j]})`;
          updateClosest(result2, expr2);
  
          const result3 = numbers[i] * numbers[j];
          const expr3 = `${numbers[i]}*${numbers[j]}`;
          updateClosest(result3, expr3);
  
          if (numbers[j] !== 0 && numbers[i] % numbers[j] === 0) {
            const result4 = numbers[i] / numbers[j];
            const expr4 = `${numbers[i]}/${numbers[j]}`;
            updateClosest(result4, expr4);
          }
        }
      }
    }
  
    console.log("The closest target is:", closest, "using the expression:", expression);
  
    function updateClosest(result, expr) {
      const diff = Math.abs(target - result);
      if (diff < Math.abs(target - closest)) {
        closest = result;
        expression = expr;
      }
    }
  }

  generateNumberGame()