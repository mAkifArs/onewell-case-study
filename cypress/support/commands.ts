// ═══════════════════════════════════════════════════════════════════════════════
// CYPRESS CUSTOM COMMANDS
// Reusable commands for E2E tests
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get element by data-testid attribute
 * @example cy.getByTestId('project-selector')
 */
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

/**
 * Wait for loading states to complete
 * Checks that no skeleton loaders are visible
 */
Cypress.Commands.add('waitForLoad', () => {
  // Wait for any loading skeletons to disappear
  cy.get('[class*="skeleton"]', { timeout: 10000 }).should('not.exist')
})

/**
 * Navigate to the first available project dashboard
 */
Cypress.Commands.add('visitFirstProject', () => {
  cy.visit('/')
  
  // Wait for projects to load
  cy.getByTestId('project-table').should('exist')
  cy.get('[class*="skeleton"]').should('not.exist')
  
  // Click the first project row
  cy.getByTestId('project-table')
    .find('tbody tr')
    .first()
    .click()
  
  // Verify we're on a project page
  cy.url().should('match', /\/projects\/proj-\d+/)
  
  // Wait for dashboard to load
  cy.getByTestId('project-header').should('exist')
})

export {}

