import { faker } from '@faker-js/faker';

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function generateUsername() {
  const adjective = capitalize(faker.word.adjective().replace(/\s+/g, '').replace(/-/g, ''));
  const animal = capitalize(faker.animal.type().replace(/\s+/g, '').replace(/-/g, ''));
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${animal}${number}`;
}

export default generateUsername;
