import { useState } from 'react';
import { TimeSelector } from './TimeSelector';
import { EventRandomizer } from './EventRandomizer';
import { GenerationControlPanel } from './GenerationControlPanel';
import type { Coordinates, TimeSelection, GeneratedImage, NotableEvent } from '../types';
import './ControlsTabs.css';

interface ControlsTabsProps {
  selectedLocation?: Coordinates;
  selectedTime?: TimeSelection;
  onTimeChange: (time: TimeSelection) => void;
  onEventSelect: (event: NotableEvent) => void;
  onImageGenerated: (image: GeneratedImage) => void;
  onError: (error: string) => void;
}

type TabId = 'time' | 'fate';

export function ControlsTabs({
  selectedLocation,
  selectedTime,
  onTimeChange,
  onEventSelect,
  onImageGenerated,
  onError,
}: ControlsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('time');

  const tabs = [
    { id: 'time' as TabId, label: '⏰ Temporal Gateway', icon: '🕰️' },
    { id: 'fate' as TabId, label: "🎃 Fate's Wheel", icon: '🎲' },
  ];

  return (
    <div className="controls-tabs">
      {/* Tab buttons */}
      <div className="tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="tabs-content">
        {/* Time Selector Panel */}
        <div
          id="panel-time"
          role="tabpanel"
          aria-labelledby="tab-time"
          className={`tab-panel ${activeTab === 'time' ? 'active' : ''}`}
        >
          {activeTab === 'time' && (
            <TimeSelector onTimeChange={onTimeChange} selectedTime={selectedTime} />
          )}
        </div>

        {/* Fate's Wheel Panel */}
        <div
          id="panel-fate"
          role="tabpanel"
          aria-labelledby="tab-fate"
          className={`tab-panel ${activeTab === 'fate' ? 'active' : ''}`}
        >
          {activeTab === 'fate' && <EventRandomizer onEventSelect={onEventSelect} />}
        </div>
      </div>

      {/* Generate button - always visible */}
      <div className="generate-section">
        <GenerationControlPanel
          selectedLocation={selectedLocation}
          selectedTime={selectedTime}
          onImageGenerated={onImageGenerated}
          onError={onError}
        />
      </div>
    </div>
  );
}
