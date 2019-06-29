describe('Unused variable', () => {
  it('should emit an error with a message', () => {
    const r = Promise.reject('Unused rejected promise');
    expect(true).toBe(true);
  });
});