describe('Audio Player', () => {
  it('plays audion', () => {
    cy.visit('/')
    cy.get('.composition-name:first').click()
    cy.get('#play_button').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)
    cy.get('#play_button').click()
  })
})