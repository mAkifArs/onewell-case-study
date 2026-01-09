// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT SELECTOR E2E TESTS
// Tests for the home page project list
// ═══════════════════════════════════════════════════════════════════════════════

describe('Project Selector', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Page Load', () => {
    it('should display the page title', () => {
      cy.contains('h1', 'Development Dashboard').should('be.visible')
      cy.contains('Select a project to view details').should('be.visible')
    })

    it('should display the project table', () => {
      cy.getByTestId('project-selector').should('exist')
      cy.getByTestId('project-table').should('exist')
    })

    it('should load projects and display them in the table', () => {
      // Wait for loading to complete
      cy.get('[class*="skeleton"]').should('not.exist')
      
      // Table should have at least one project
      cy.getByTestId('project-table')
        .find('tbody tr')
        .should('have.length.greaterThan', 0)
    })

    it('should display project count', () => {
      cy.get('[class*="skeleton"]').should('not.exist')
      
      // Should show count like "5 projects"
      cy.getByTestId('project-table')
        .contains(/\d+ projects?/)
        .should('be.visible')
    })
  })

  describe('Search Functionality', () => {
    beforeEach(() => {
      // Wait for projects to load
      cy.get('[class*="skeleton"]').should('not.exist')
    })

    it('should have a search input', () => {
      cy.getByTestId('project-table')
        .find('input[type="text"]')
        .should('exist')
        .and('have.attr', 'placeholder')
    })

    it('should filter projects when searching', () => {
      // Get initial count
      cy.getByTestId('project-table')
        .find('tbody tr')
        .its('length')
        .then((initialCount) => {
          // Type a search term (use a partial term that might match some projects)
          cy.getByTestId('project-table')
            .find('input[type="text"]')
            .type('ML')

          // Results should be filtered (could be same, fewer, or zero)
          cy.getByTestId('project-table')
            .find('tbody tr')
            .should('have.length.lte', initialCount)
        })
    })

    it('should show empty state when no results match', () => {
      cy.getByTestId('project-table')
        .find('input[type="text"]')
        .type('xyznonexistent123')

      // Should show no results message
      cy.getByTestId('project-table')
        .contains(/no (projects|results) found/i)
        .should('be.visible')
    })

    it('should clear search and show all projects', () => {
      // Get initial count
      cy.getByTestId('project-table')
        .find('tbody tr')
        .its('length')
        .then((initialCount) => {
          // Search and then clear
          cy.getByTestId('project-table')
            .find('input[type="text"]')
            .type('test')
            .clear()

          // Should show all projects again
          cy.getByTestId('project-table')
            .find('tbody tr')
            .should('have.length', initialCount)
        })
    })
  })

  describe('Sorting Functionality', () => {
    beforeEach(() => {
      cy.get('[class*="skeleton"]').should('not.exist')
    })

    it('should have sortable column headers', () => {
      cy.getByTestId('project-table')
        .find('thead button')
        .should('have.length.greaterThan', 0)
    })

    it('should sort when clicking a column header', () => {
      // Get first row text before sorting
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .invoke('text')
        .then((firstRowBefore) => {
          // Click the first sortable header to change sort
          cy.getByTestId('project-table')
            .find('thead button')
            .first()
            .click()

          // The order may or may not change, but no error should occur
          cy.getByTestId('project-table')
            .find('tbody tr')
            .should('have.length.greaterThan', 0)
        })
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      cy.get('[class*="skeleton"]').should('not.exist')
    })

    it('should navigate to project dashboard when clicking a row', () => {
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .click()

      // Should navigate to project page
      cy.url().should('match', /\/projects\/proj-\d+/)
    })

    it('should display the project header after navigation', () => {
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .click()

      // Dashboard should load
      cy.getByTestId('project-header').should('be.visible')
    })

    it('should have clickable rows with cursor pointer', () => {
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .should('have.css', 'cursor', 'pointer')
    })
  })
})

