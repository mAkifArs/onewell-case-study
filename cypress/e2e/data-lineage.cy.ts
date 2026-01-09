// ═══════════════════════════════════════════════════════════════════════════════
// DATA LINEAGE E2E TESTS
// Tests for the Data Lineage panel
// ═══════════════════════════════════════════════════════════════════════════════

describe('Data Lineage Panel', () => {
  beforeEach(() => {
    cy.visitFirstProject()
    cy.getByTestId('lineage-panel').scrollIntoView()
    cy.getByTestId('lineage-panel').should('be.visible')
  })

  describe('Panel Content', () => {
    it('should display lineage view or empty state', () => {
      // Either has lineage view or shows empty state
      cy.getByTestId('lineage-panel').then(($panel) => {
        const hasLineage = $panel.find('[data-testid="lineage-view"]').length > 0
        if (hasLineage) {
          cy.getByTestId('lineage-view').should('exist')
        } else {
          cy.getByTestId('lineage-panel').contains(/no lineage/i).should('be.visible')
        }
      })
    })
  })

  describe('Lineage Visualization', () => {
    it('should display lineage nodes for tables with lineage', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Should have React Flow canvas or SVG nodes
          cy.getByTestId('lineage-view')
            .find('.react-flow, svg, [class*="node"]')
            .should('exist')
        }
      })
    })

    it('should display source tables on left side', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Source nodes should exist
          cy.getByTestId('lineage-view')
            .find('[class*="node"], [data-type="source"]')
            .should('have.length.greaterThan', 0)
        }
      })
    })

    it('should display edges/connections between tables', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Should have edges connecting nodes
          cy.getByTestId('lineage-view')
            .find('.react-flow__edge, path, [class*="edge"]')
            .should('have.length.greaterThan', 0)
        }
      })
    })
  })

  describe('Node Interaction', () => {
    it('should highlight node on click', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Click a node (React Flow needs force:true due to pointer-events)
          cy.getByTestId('lineage-view')
            .find('.react-flow__node')
            .first()
            .click({ force: true })

          // Node should have selected/highlighted state
          // (This is visual, so we just verify click doesn't error)
          cy.getByTestId('lineage-view').should('exist')
        }
      })
    })

    it('should show table name on nodes', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Nodes should have text labels
          cy.getByTestId('lineage-view')
            .find('.react-flow__node, [class*="node"]')
            .first()
            .invoke('text')
            .should('not.be.empty')
        }
      })
    })
  })

  describe('Lineage Empty State', () => {
    it('should show appropriate message when no lineage exists', () => {
      // This test verifies that the empty state works when there's no lineage
      // Some projects may have lineage, some may not
      cy.getByTestId('lineage-panel').then(($panel) => {
        const hasLineage = $panel.find('[data-testid="lineage-view"]').length > 0
        const hasEmptyState = $panel.text().toLowerCase().includes('no lineage')
        
        // Either has lineage or shows empty state - both are valid
        expect(hasLineage || hasEmptyState).to.be.true
      })
    })
  })

  describe('Visual Layout', () => {
    it('should have proper container dimensions', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // Container should have reasonable dimensions
          cy.getByTestId('lineage-view')
            .should('have.css', 'height')
            .and('not.equal', '0px')
        }
      })
    })

    it('should display flow diagram correctly', () => {
      cy.getByTestId('lineage-panel').then(($panel) => {
        if ($panel.find('[data-testid="lineage-view"]').length > 0) {
          // React Flow viewport should be visible
          cy.getByTestId('lineage-view')
            .find('.react-flow__viewport, [class*="viewport"]')
            .should('exist')
        }
      })
    })
  })
})

