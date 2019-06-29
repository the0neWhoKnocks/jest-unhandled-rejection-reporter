describe('Uncaught Promise', () => {
  it('should emit an error with no message', () => {
    Promise.reject()
      .then(() => {
        expect(true).toBe(true);
      });
  });
  
  it('should emit an error with a message', () => {
    Promise.reject('failed promise')
      .then(() => {
        expect(true).toBe(true);
      });
  });
});