describe('import vue components', () => {
  test('normal imports as expected', async () => {
    const cmp = await import('../App.vue');
    expect(cmp).toBeDefined();
  });

  test('dynamic imports as expected', async () => {
    const name = 'App';
    const cmp = await import(`../${name}.vue`);
    expect(cmp).toBeDefined();
  });
});
