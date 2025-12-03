/**
 * Demo file showing how to integrate the EventRandomizer component
 * This file demonstrates the usage pattern for the EventRandomizer
 */

import { EventRandomizer } from './EventRandomizer';
import type { NotableEvent } from '../types';

export function EventRandomizerDemo() {
  const handleEventSelect = (event: NotableEvent) => {
    console.log('Selected event:', event);
    
    // In a real application, you would:
    // 1. Update the globe to show the event's location
    // 2. Update the time selector to show the event's time
    // 3. Store the event in application state
    
    // Example:
    // setSelectedLocation(event.location);
    // setSelectedTime(event.time);
    // setCurrentEvent(event);
  };

  return (
    <div style={{ padding: '2rem', background: '#0a0a0a', minHeight: '100vh' }}>
      <EventRandomizer onEventSelect={handleEventSelect} />
    </div>
  );
}
