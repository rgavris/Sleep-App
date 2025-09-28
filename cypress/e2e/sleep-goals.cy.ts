describe('Sleep Goals Component', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for page to load and animations to complete
    cy.get('body').should('be.visible')
    cy.wait(3000) // Wait for animations to complete
    // Look for the Goals navigation item and click it
    cy.contains('Goals').click()
    // Wait for the goals page to load
    cy.wait(2000)
  })

  it('debug - shows what is on the page', () => {
    cy.get('body').then(($body) => {
      cy.log('Page content:', $body.text())
    })
  })

  it('displays the sleep goals title', () => {
    cy.contains('🎯 Sleep Goals').should('be.visible')
  })

  it('shows add goal button', () => {
    cy.contains('Add Goal').should('be.visible')
  })

  it('displays empty state when no goals', () => {
    cy.contains('No Sleep Goals Set').should('be.visible')
    cy.contains('Set your first sleep goal to start improving your sleep habits').should('be.visible')
  })

  it('opens add goal dialog when add button is clicked', () => {
    cy.contains('Add Goal').click()
    cy.contains('Add New Sleep Goal').should('be.visible')
    cy.get('input[type="number"]').should('be.visible')
    cy.get('input[type="time"]').should('have.length', 2)
  })
})
