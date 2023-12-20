describe('/api/parseNews endpoint', () => {
  it('Should parse news', () => {
    const newsUrl = 'https://incidentdatabase.ai/blog/improv-ai/';

    cy.request('GET', `/api/parseNews?url=${encodeURIComponent(newsUrl)}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq('How to Understand Large Language Models through Improv');
    });
  });
});
