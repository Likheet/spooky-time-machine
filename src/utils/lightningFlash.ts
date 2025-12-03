/**
 * Lightning Flash Utility
 * Triggers lightning flash animations for major state changes
 */

export class LightningFlash {
  private static flashElement: HTMLDivElement | null = null;

  /**
   * Initialize the lightning flash overlay
   */
  static initialize(): void {
    if (this.flashElement) return;

    this.flashElement = document.createElement('div');
    this.flashElement.className = 'lightning-flash-overlay';
    this.flashElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(57, 255, 20, 0.3) 50%, transparent 100%);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.05s ease;
    `;
    document.body.appendChild(this.flashElement);
  }

  /**
   * Trigger a lightning flash animation
   */
  static trigger(): void {
    if (!this.flashElement) {
      this.initialize();
    }

    if (!this.flashElement) return;

    // First flash
    this.flashElement.style.opacity = '1';
    setTimeout(() => {
      if (this.flashElement) this.flashElement.style.opacity = '0';
    }, 50);

    // Second flash (slightly delayed)
    setTimeout(() => {
      if (this.flashElement) this.flashElement.style.opacity = '0.7';
      setTimeout(() => {
        if (this.flashElement) this.flashElement.style.opacity = '0';
      }, 30);
    }, 150);

    // Third flash (final)
    setTimeout(() => {
      if (this.flashElement) this.flashElement.style.opacity = '0.5';
      setTimeout(() => {
        if (this.flashElement) this.flashElement.style.opacity = '0';
      }, 40);
    }, 250);
  }

  /**
   * Cleanup the lightning flash element
   */
  static cleanup(): void {
    if (this.flashElement && this.flashElement.parentNode) {
      this.flashElement.parentNode.removeChild(this.flashElement);
      this.flashElement = null;
    }
  }
}
