/**
 * Performance Monitoring Utility
 * Provides utilities for monitoring and optimizing application performance
 */

export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  /**
   * Start a performance measurement
   * @param label - Label for the measurement
   */
  static start(label: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`);
    }
    this.marks.set(label, Date.now());
  }

  /**
   * End a performance measurement and log the duration
   * @param label - Label for the measurement
   */
  static end(label: string): void {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`Performance measurement "${label}" was not started`);
      return;
    }

    const duration = Date.now() - startTime;
    this.marks.delete(label);

    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      try {
        performance.measure(label, `${label}-start`, `${label}-end`);
      } catch (e) {
        // Ignore errors if marks don't exist
      }
    }

    // Log slow operations (> 100ms)
    if (duration > 100) {
      console.warn(`[Performance] "${label}" took ${duration}ms`);
    } else if (import.meta.env.DEV) {
      console.log(`[Performance] "${label}" took ${duration}ms`);
    }
  }

  /**
   * Measure the execution time of an async function
   * @param label - Label for the measurement
   * @param fn - Async function to measure
   * @returns Result of the function
   */
  static async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }

  /**
   * Get performance metrics from the browser
   */
  static getMetrics(): PerformanceMetrics | null {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) {
      return null;
    }

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
    };
  }

  /**
   * Get First Paint timing
   */
  private static getFirstPaint(): number | null {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return null;
    }

    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get First Contentful Paint timing
   */
  private static getFirstContentfulPaint(): number | null {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return null;
    }

    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : null;
  }

  /**
   * Log performance metrics to console
   */
  static logMetrics(): void {
    const metrics = this.getMetrics();
    if (!metrics) {
      console.log('[Performance] Metrics not available');
      return;
    }

    console.group('[Performance Metrics]');
    console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`DOM Interactive: ${metrics.domInteractive.toFixed(2)}ms`);
    if (metrics.firstPaint) {
      console.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    }
    if (metrics.firstContentfulPaint) {
      console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    }
    console.groupEnd();
  }
}

interface PerformanceMetrics {
  domContentLoaded: number;
  loadComplete: number;
  domInteractive: number;
  firstPaint: number | null;
  firstContentfulPaint: number | null;
}

// Log metrics on page load in development
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      PerformanceMonitor.logMetrics();
    }, 0);
  });
}
