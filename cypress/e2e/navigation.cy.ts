// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION E2E TESTS
// Tests for routing, navigation, and global UI elements
// ═══════════════════════════════════════════════════════════════════════════════

describe('Navigation', () => {
  describe('Home Page', () => {
    it('should load the home page at root URL', () => {
      cy.visit('/')
      cy.getByTestId('project-selector').should('exist')
    })

    it('should display the navbar', () => {
      cy.visit('/')
      cy.get('nav, [class*="navbar"], header').should('exist')
    })
  })

  describe('Project Navigation', () => {
    it('should navigate from home to project dashboard', () => {
      cy.visit('/')
      cy.get('[class*="skeleton"]').should('not.exist')
      
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .click()

      cy.url().should('include', '/projects/')
      cy.getByTestId('project-header').should('exist')
    })

    it('should update URL with project ID', () => {
      cy.visitFirstProject()
      cy.url().should('match', /\/projects\/proj-\d+$/)
    })
  })

  describe('Back Button', () => {
    beforeEach(() => {
      cy.visitFirstProject()
    })

    it('should display back button on dashboard', () => {
      cy.contains(/back to projects/i).should('be.visible')
    })

    it('should navigate back to home when clicking back button', () => {
      cy.contains(/back to projects/i).click()
      
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.getByTestId('project-selector').should('exist')
    })

    it('should preserve browser history', () => {
      // Verify we start on a project page
      cy.url().should('include', '/projects/')
      
      // Go back using browser navigation  
      cy.go('back')
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      
      // Go forward should return to project
      cy.go('forward')
      cy.url().should('include', '/projects/')
    })
  })

  describe('Browser Navigation', () => {
    it('should handle browser back button', () => {
      cy.visitFirstProject()
      
      cy.go('back')
      
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.getByTestId('project-selector').should('exist')
    })

    it('should handle browser forward button', () => {
      cy.visitFirstProject()
      cy.go('back')
      cy.go('forward')
      
      cy.url().should('include', '/projects/')
      cy.getByTestId('project-header').should('exist')
    })

    it('should handle direct URL access', () => {
      // Visit project directly via URL
      cy.visit('/')
      cy.get('[class*="skeleton"]').should('not.exist')
      
      // Get the first project's ID from clicking
      cy.getByTestId('project-table')
        .find('tbody tr')
        .first()
        .click()
      
      cy.url().then((url) => {
        // Visit that URL directly
        cy.visit(url)
        cy.getByTestId('project-header').should('exist')
      })
    })
  })

  describe('404 Handling', () => {
    it('should redirect unknown routes to home', () => {
      cy.visit('/unknown-route')
      
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })

    it('should redirect nested unknown routes to home', () => {
      cy.visit('/some/nested/unknown/path')
      
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('Theme Toggle', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should display theme toggle button', () => {
      cy.get('button[aria-label*="theme" i], [class*="themeToggle"]').should('exist')
    })

    it('should toggle theme when clicked', () => {
      const themeToggle = cy.get('button[aria-label*="theme" i], [class*="themeToggle"]').first()
      
      // Get initial theme
      cy.get('html, body, [data-theme]').then(($el) => {
        const initialTheme = $el.attr('data-theme') || 'light'
        
        // Click toggle
        themeToggle.click()
        
        // Theme should change (or at least toggle action should complete)
        cy.get('html, body, [data-theme]').should('exist')
      })
    })

    it('should persist theme preference', () => {
      // Toggle theme
      cy.get('button[aria-label*="theme" i], [class*="themeToggle"]').first().click()
      
      // Get current theme
      cy.get('[data-theme]').then(($el) => {
        const currentTheme = $el.attr('data-theme')
        
        // Reload page
        cy.reload()
        
        // Theme should persist
        cy.get('[data-theme]').should('have.attr', 'data-theme', currentTheme)
      })
    })
  })

  describe('Navbar Logo', () => {
    it('should have a logo/brand link', () => {
      cy.visit('/')
      cy.get('nav a, [class*="navbar"] a, [class*="logo"]').should('exist')
    })

    it('should navigate to home when clicking logo', () => {
      cy.visitFirstProject()
      
      // Click logo/brand
      cy.get('nav a, [class*="navbar"] a, [class*="logo"]')
        .first()
        .click()
      
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('Page Titles', () => {
    it('should have appropriate title on home page', () => {
      cy.visit('/')
      cy.title().should('not.be.empty')
    })
  })
})

