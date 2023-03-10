export function intToChar(int) {
    // 👇️ for Uppercase letters, replace `a` with `A`
    const code = 'a'.charCodeAt(0);
    return String.fromCharCode(code + int);
}

export function getRandomInt(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

export function isWord(text) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/search',
        type: 'GET',
        data: { word: text },
        success: function (data) {
          if (data[0] != null) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: function (e) {
          reject(e);
        }
      });
    });
  }
  
export function containsLetters(word, letters) {
    const wordLetters = word.toLowerCase().split("");
    const remainingLetters = [...letters];
    for (const letter of wordLetters) {
      const index = remainingLetters.indexOf(letter);
      console.log(letters);
      console.log(remainingLetters.indexOf(letter));
      if (index === -1) {
        return false;
      }
      remainingLetters.splice(index, 1);
    }
    return true;
  }