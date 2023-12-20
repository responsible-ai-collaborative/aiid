describe('/api/semanticallyRelated endpoint', () => {
  it('Should get semantically related', () => {
    cy.request({
      url: `/api/semanticallyRelated`,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: '{"text":"Child and consumer advocacy groups complained to the Federal Trade Commission Tuesday that Google’s new YouTube Kids app contains “inappropriate content,” including explicit sexual language and jokes about pedophilia. Google launched the app for young children in February, saying the available videos were “narrowed down to content appropriate for kids.”"}',
      method: 'POST',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.incidents[0].incident_id).to.eq(1);
    });
  });
});
