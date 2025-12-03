import { useState, useEffect, memo } from 'react';
import type { TimeSelection } from '../types';
import './TimeSelector.css';

interface TimeSelectorProps {
  onTimeChange: (time: TimeSelection) => void;
  selectedTime?: TimeSelection;
}

function TimeSelectorComponent({ onTimeChange, selectedTime }: TimeSelectorProps) {
  const [year, setYear] = useState<number>(selectedTime?.year ?? 1900);
  const [month, setMonth] = useState<number>(selectedTime?.month ?? 1);
  const [day, setDay] = useState<number>(selectedTime?.day ?? 1);
  const [era, setEra] = useState<'BCE' | 'CE'>(
    (selectedTime?.era as 'BCE' | 'CE') ?? 'CE'
  );

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate max days in selected month
  const getDaysInMonth = (year: number, month: number, era: string): number => {
    // For BCE, we need to handle the year differently
    const adjustedYear = era === 'BCE' ? -year + 1 : year;
    
    // Handle February leap years
    if (month === 2) {
      const isLeapYear = (adjustedYear % 4 === 0 && adjustedYear % 100 !== 0) || 
                         (adjustedYear % 400 === 0);
      return isLeapYear ? 29 : 28;
    }
    
    // Months with 30 days
    if ([4, 6, 9, 11].includes(month)) {
      return 30;
    }
    
    // Months with 31 days
    return 31;
  };

  const maxDays = getDaysInMonth(year, month, era);

  // Adjust day if it exceeds max days in month
  useEffect(() => {
    if (day > maxDays) {
      setDay(maxDays);
    }
  }, [maxDays, day]);

  // Format display name
  const formatDisplayName = (): string => {
    const monthName = monthNames[month - 1];
    return `${monthName} ${day}, ${year} ${era}`;
  };

  // Emit time change
  useEffect(() => {
    const timeSelection: TimeSelection = {
      year,
      month,
      day,
      era,
      displayName: formatDisplayName()
    };
    onTimeChange(timeSelection);
  }, [year, month, day, era]);

  // Validate year input
  const validateYear = (value: number): boolean => {
    return !isNaN(value) && value >= 1 && value <= 9999;
  };

  // Handle year input change with validation
  const handleYearChange = (value: string) => {
    // Allow empty string for user to clear and retype
    if (value === '') {
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (validateYear(numValue)) {
      setYear(numValue);
    }
  };

  // Handle year slider change
  const handleYearSliderChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (validateYear(numValue)) {
      setYear(numValue);
    }
  };

  // Validate month (1-12)
  const validateMonth = (value: number): boolean => {
    return !isNaN(value) && value >= 1 && value <= 12;
  };

  // Validate day based on month and year
  const validateDay = (value: number, month: number, year: number, era: string): boolean => {
    if (isNaN(value) || value < 1) return false;
    const maxDays = getDaysInMonth(year, month, era);
    return value <= maxDays;
  };

  return (
    <div className="time-selector">
      <div className="time-selector-header">
        <h2 className="time-selector-title">Temporal Gateway</h2>
        <p className="time-selector-subtitle">Choose your moment in history...</p>
      </div>

      <div className="time-selector-content">
        {/* Era Toggle */}
        <div className="era-toggle-container">
          <label className="era-label">Era</label>
          <div className="era-toggle">
            <button
              className={`era-button ${era === 'BCE' ? 'active' : ''}`}
              onClick={() => setEra('BCE')}
              type="button"
            >
              BCE
            </button>
            <button
              className={`era-button ${era === 'CE' ? 'active' : ''}`}
              onClick={() => setEra('CE')}
              type="button"
            >
              CE
            </button>
          </div>
        </div>

        {/* Year Input and Slider */}
        <div className="year-control-container">
          <label className="control-label">Year</label>
          <div className="year-input-group">
            <input
              type="number"
              className="year-input"
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              min="1"
              max="9999"
              placeholder="Year"
            />
            <span className="era-indicator">{era}</span>
          </div>
          <input
            type="range"
            className="year-slider"
            value={year}
            onChange={(e) => handleYearSliderChange(e.target.value)}
            min="1"
            max="2024"
            step="1"
          />
          <div className="slider-labels">
            <span>1</span>
            <span>2024</span>
          </div>
        </div>

        {/* Month Selector */}
        <div className="month-control-container">
          <label className="control-label">Month</label>
          <select
            className="month-select"
            value={month}
            onChange={(e) => {
              const newMonth = parseInt(e.target.value, 10);
              if (validateMonth(newMonth)) {
                setMonth(newMonth);
              }
            }}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selector */}
        <div className="day-control-container">
          <label className="control-label">Day</label>
          <select
            className="day-select"
            value={day}
            onChange={(e) => {
              const newDay = parseInt(e.target.value, 10);
              if (validateDay(newDay, month, year, era)) {
                setDay(newDay);
              }
            }}
          >
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Display Selected Time */}
        <div className="time-display">
          <div className="time-display-label">Selected Time</div>
          <div className="time-display-value">{formatDisplayName()}</div>
        </div>
      </div>

      {/* Ghostly wisp effect */}
      <div className="wisp wisp-1"></div>
      <div className="wisp wisp-2"></div>
      <div className="wisp wisp-3"></div>
    </div>
  );
}

// Memoize the TimeSelector component
export const TimeSelector = memo(TimeSelectorComponent);
