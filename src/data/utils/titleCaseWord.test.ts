import titleCaseWord from './titleCaseWord';

describe('titleCaseWord', () => {
  it('title cases word successfully', async () => {
    const word = 'test';
    const titleCasedWord = titleCaseWord(word);

    expect(titleCasedWord).toEqual('Test');
  });

  it('title cases word successfully', async () => {
    const word = 'test test test';
    const titleCasedWord = titleCaseWord(word);

    expect(titleCasedWord).toEqual('Test test test');
  });

  it('title cases word successfully', async () => {
    const word = '';
    const titleCasedWord = titleCaseWord(word);

    expect(titleCasedWord).toEqual('');
  });

  it('title cases word successfully', async () => {
    const word = 'tEST';
    const titleCasedWord = titleCaseWord(word);

    expect(titleCasedWord).toEqual('TEST');
  });
});
