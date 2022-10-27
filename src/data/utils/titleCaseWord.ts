const titleCaseWord = (word: string) => {
  if (word === '') {
    return '';
  }

  return word[0].toUpperCase() + word.substring(1);
};

export default titleCaseWord;
