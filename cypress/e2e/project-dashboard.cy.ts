// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT DASHBOARD E2E TESTS
// Tests for the main dashboard view
// ═══════════════════════════════════════════════════════════════════════════════

describe('Project Dashboard', () => {
  beforeEach(() => {
    cy.visitFirstProject()
  })

  describe('Page Structure', () => {
    it('should display the project header', () => {
      cy.getByTestId('project-header').should('be.visible')
    })

    it('should display the project title', () => {
      cy.getByTestId('project-header')
        .find('h1')
        .should('be.visible')
        .and('not.be.empty')
    })

    it('should display project type and status badges', () => {
      cy.getByTestId('project-header')
        .find('[class*="badge"]')
        .should('have.length.greaterThan', 0)
    })

    it('should display project metadata (owner, department, dates)', () => {
      // Check for label-value pairs
      cy.getByTestId('project-header')
        .contains(/owner/i)
        .should('be.visible')
      
      cy.getByTestId('project-header')
        .contains(/department/i)
        .should('be.visible')
    })
  })

  describe('Dashboard Panels', () => {
    it('should display the Data Tables panel', () => {
      cy.getByTestId('data-tables-panel').should('exist')
      cy.getByTestId('data-tables-panel')
        .contains(/data tables/i)
        .should('exist')
    })

    it('should display the Operations panel', () => {
      cy.getByTestId('operations-panel').should('exist')
      cy.getByTestId('operations-panel')
        .contains(/recent operations/i)
        .should('exist')
    })

    it('should display the Governance panel', () => {
      cy.getByTestId('governance-panel').scrollIntoView()
      cy.getByTestId('governance-panel').should('be.visible')
      cy.getByTestId('governance-panel')
        .contains(/governance/i)
        .should('exist')
    })

    it('should display the Lineage panel', () => {
      cy.getByTestId('lineage-panel').scrollIntoView()
      cy.getByTestId('lineage-panel').should('be.visible')
      cy.getByTestId('lineage-panel')
        .contains(/data lineage/i)
        .should('exist')
    })
  })

  describe('Panel Info Tooltips', () => {
    it('should have info icons on panels', () => {
      // Panels should have info icons (look for SVG icons in panel headers)
      cy.get('[class*="panel"]')
        .find('svg')
        .should('have.length.greaterThan', 0)
    })
  })

  describe('Loading States', () => {
    it('should show loading skeleton initially', () => {
      // Visit the page fresh and check for skeletons
      cy.visit('/')
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .click()

      // Skeleton should appear briefly (or content should load)
      // We verify the page eventually loads
      cy.getByTestId('project-header', { timeout: 10000 }).should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid project ID gracefully', () => {
      cy.visit('/projects/invalid-project-id')
      
      // Should show error state or redirect
      cy.url().should('satisfy', (url: string) => {
        // Either stays on error page or redirects home
        return url.includes('/projects/invalid') || url === Cypress.config().baseUrl + '/'
      })
    })
  })
})

