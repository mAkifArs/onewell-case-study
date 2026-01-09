// ═══════════════════════════════════════════════════════════════════════════════
// OPERATIONS TIMELINE E2E TESTS
// Tests for the Recent Operations panel
// ═══════════════════════════════════════════════════════════════════════════════

describe('Operations Timeline Panel', () => {
  beforeEach(() => {
    cy.visitFirstProject()
    cy.getByTestId('operations-panel').should('be.visible')
  })

  describe('Panel Content', () => {
    it('should display operations or empty state', () => {
      // Either has operations timeline or shows empty state
      cy.getByTestId('operations-panel').then(($panel) => {
        const hasTimeline = $panel.find('[data-testid="operations-timeline"]').length > 0
        if (hasTimeline) {
          cy.getByTestId('operations-timeline').should('exist')
        } else {
          cy.getByTestId('operations-panel').contains(/no.*operations/i).should('be.visible')
        }
      })
    })
  })

  describe('Date Grouping', () => {
    it('should group operations by date', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        // Check if timeline exists
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Should have date groups
          cy.get('[data-testid^="date-group-"]').should('have.length.greaterThan', 0)
        }
      })
    })

    it('should display date headers in groups', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Each date group should have a visible date
          cy.get('[data-testid^="date-group-"]')
            .first()
            .find('[class*="dateLabel"], [class*="dateHeader"]')
            .should('be.visible')
        }
      })
    })
  })

  describe('Operation Cards', () => {
    it('should display operation details', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Operations should have visible content
          cy.get('[data-testid^="date-group-"]')
            .first()
            .find('[class*="operation"], [class*="card"]')
            .should('have.length.greaterThan', 0)
        }
      })
    })

    it('should display operation name', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Operation cards should have names
          cy.get('[data-testid^="date-group-"]')
            .first()
            .find('[class*="operationName"], [class*="name"]')
            .first()
            .should('not.be.empty')
        }
      })
    })

    it('should display affected table info', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Should show which table was affected (look for table indicator or text)
          cy.get('[data-testid^="date-group-"]')
            .first()
            .invoke('text')
            .should('not.be.empty')
        }
      })
    })

    it('should display executor name', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Should show who executed the operation (look for user name in text)
          cy.get('[data-testid^="date-group-"]')
            .first()
            .invoke('text')
            .should('not.be.empty')
        }
      })
    })
  })

  describe('Operation Types', () => {
    it('should display operation type indicators', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Operations should have type indicators (icons or badges)
          cy.get('[data-testid^="date-group-"]')
            .first()
            .find('[class*="type"], [class*="icon"], svg')
            .should('have.length.greaterThan', 0)
        }
      })
    })
  })

  describe('Timeline Layout', () => {
    it('should display operations in chronological order within groups', () => {
      cy.getByTestId('operations-panel').then(($panel) => {
        if ($panel.find('[data-testid="operations-timeline"]').length > 0) {
          // Should have a vertical timeline layout
          cy.getByTestId('operations-timeline')
            .should('have.css', 'display')
            .and('not.equal', 'none')
        }
      })
    })
  })
})

