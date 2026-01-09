// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE E2E TESTS
// Tests for the Governance panel
// ═══════════════════════════════════════════════════════════════════════════════

describe('Governance Panel', () => {
  beforeEach(() => {
    cy.visitFirstProject()
    cy.getByTestId('governance-panel').scrollIntoView()
    cy.getByTestId('governance-panel').should('be.visible')
  })

  describe('Panel Content', () => {
    it('should display governance content or empty state', () => {
      // Either has governance content or shows empty state
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasApprovals = $panel.find('[data-testid^="approval-item-"]').length > 0
        const hasStakeholders = $panel.find('[data-testid="stakeholder-list"]').length > 0
        const hasEmptyState = $panel.text().toLowerCase().includes('no governance')
        
        expect(hasApprovals || hasStakeholders || hasEmptyState).to.be.true
      })
    })
  })

  describe('Approvals Section', () => {
    it('should display approvals if available', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasApprovals = $panel.find('[data-testid^="approval-item-"]').length > 0
        
        if (hasApprovals) {
          // Should have approval title
          cy.contains(/approvals/i).should('be.visible')
          
          // Should have at least one approval card
          cy.get('[data-testid^="approval-item-"]').should('have.length.greaterThan', 0)
        }
      })
    })

    it('should display approval type and status', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        if ($panel.find('[data-testid^="approval-item-"]').length > 0) {
          cy.get('[data-testid^="approval-item-"]').first().within(() => {
            // Should show approval type
            cy.get('[class*="approvalType"], [class*="type"]').should('exist')
            
            // Should show status
            cy.get('[class*="approvalStatus"], [class*="status"]').should('exist')
          })
        }
      })
    })

    it('should display approval status with visual indicator', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const approvalStatuses = $panel.find('[data-testid^="approval-status-"]')
        
        if (approvalStatuses.length > 0) {
          // Status badges should have icons
          cy.get('[data-testid^="approval-status-"]')
            .first()
            .find('svg')
            .should('exist')
        }
      })
    })

    it('should display approver information', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        if ($panel.find('[data-testid^="approval-item-"]').length > 0) {
          // Should show approver name
          cy.get('[data-testid^="approval-item-"]')
            .first()
            .contains(/approver/i)
            .should('exist')
        }
      })
    })
  })

  describe('Compliance Checklist', () => {
    it('should display compliance progress if available', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasCompliance = $panel.find('[class*="compliance"], [class*="progress"]').length > 0
        
        if (hasCompliance) {
          // Should have compliance section
          cy.get('[class*="compliance"]').should('exist')
        }
      })
    })

    it('should display progress bar', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasCompliance = $panel.find('[class*="progressBar"], [class*="progress"]').length > 0
        
        if (hasCompliance) {
          // Progress bar should be visible
          cy.get('[class*="progressBar"], [class*="progress"]')
            .first()
            .should('be.visible')
        }
      })
    })

    it('should display completion percentage', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasCompliance = $panel.find('[class*="compliance"]').length > 0
        
        if (hasCompliance) {
          // Should show percentage
          cy.getByTestId('governance-panel')
            .contains(/\d+%/)
            .should('exist')
        }
      })
    })

    it('should display template name', () => {
      cy.getByTestId('governance-panel').then(($panel) => {
        const hasCompliance = $panel.find('[class*="compliance"]').length > 0
        
        if (hasCompliance) {
          // Should show template name (e.g., "SR 11-7")
          cy.get('[class*="compliance"]')
            .invoke('text')
            .should('not.be.empty')
        }
      })
    })
  })

  describe('Stakeholder List', () => {
    it('should display stakeholders section', () => {
      cy.getByTestId('stakeholder-list').should('exist')
    })

    it('should display stakeholder items', () => {
      cy.getByTestId('stakeholder-list').within(() => {
        cy.get('[data-testid^="stakeholder-item-"]').should('have.length.greaterThan', 0)
      })
    })

    it('should display stakeholder name and role', () => {
      cy.get('[data-testid^="stakeholder-item-"]').first().within(() => {
        // Should have name and role text content
        cy.get('span').should('have.length.greaterThan', 0)
      })
      
      // Verify the stakeholder item has text content (name and role)
      cy.get('[data-testid^="stakeholder-item-"]')
        .first()
        .invoke('text')
        .should('not.be.empty')
    })

    it('should display stakeholder avatars', () => {
      cy.get('[data-testid^="stakeholder-item-"]').first().within(() => {
        // Should have avatar (user icon)
        cy.get('[class*="avatar"], svg').should('exist')
      })
    })
  })
})

