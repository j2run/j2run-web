export function generatePassword(length = 8) {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specialCharacters = '!@#$%^&*';

  let password = '';

  password += randomCharacter(lowercaseLetters);
  password += randomCharacter(uppercaseLetters);
  password += randomCharacter(digits);
  password += randomCharacter(specialCharacters);

  for (let i = 0; i < length - 4; i++) {
    const allCharacters =
      lowercaseLetters + uppercaseLetters + digits + specialCharacters;
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  password = shuffleString(password);

  return password;
}

function randomCharacter(characters: string) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function shuffleString(str: string) {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}
