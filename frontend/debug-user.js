// Ouvrez la console du navigateur et collez ce code pour vérifier :
console.log("User data:", localStorage.getItem('user'));
console.log("Auth context:", window.user); // si disponible

// Pour tester le parsing du nom :
const testName = "Jean Dupont";
console.log("First name:", testName.split(' ')[0]); // "Jean"
console.log("Last name:", testName.split(' ').slice(1).join(' ')); // "Dupont"
