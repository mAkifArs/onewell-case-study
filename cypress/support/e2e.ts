// ═══════════════════════════════════════════════════════════════════════════════
// CYPRESS E2E SUPPORT FILE
// Global configuration and behavior that modifies Cypress
// ═══════════════════════════════════════════════════════════════════════════════

import './commands'

// Prevent TypeScript errors when accessing Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for loading states to complete
       */
      waitForLoad(): Chainable<void>
      
      /**
       * Navigate to a project dashboard by clicking the first available project
       */
      visitFirstProject(): Chainable<void>
      
      /**
       * Get element by data-testid attribute
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

// Hide fetch/XHR logs for cleaner test output (optional)
// Cypress.on('log:added', (log) => {
//   if (log.displayName === 'fetch' || log.displayName === 'xhr') {
//     log.set({ hidden: true })
//   }
// })

// Handle uncaught exceptions gracefully
Cypress.on('uncaught:exception', (err) => {
  // React Router navigation errors can be ignored
  if (err.message.includes('ResizeObserver')) {
    return false
  }
  // Let other errors fail the test
  return true
})

