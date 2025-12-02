import { useState, useCallback } from 'react';
import { Col } from 'react-bootstrap';

// A controlled text input component with optional debouncing.
// Maintains local state for immediate UI updates while optionally debouncing the parent onChange callback.

export default function InputText({
  id,
  placeholder,
  onChange,
  onChangeDebounceDelay = 0,
}) {
  // Local state keeps the input responsive while debouncing parent callback
  const [inputValue, setInputValue] = useState('');

  const debouncedOnChange = useCallback(
    //Creates a debounced version of a function. Each call clears the previous timeout and schedules a new execution.
    (value) => {
      const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          // Define the delayed execution
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          // Clear any existing timeout and schedule new one
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };
      // Create debounced version of onChange with specified delay
      const debouncedFunc = debounce((val) => {
        if (onChange) {
          onChange(val);
        }
      }, onChangeDebounceDelay);
      // Execute the debounced function with the new value
      debouncedFunc(value);
    },
    [onChange, onChangeDebounceDelay]
  );

  //Handles input change events. Updates local state immediately for responsive UI, then either calls onChange directly or debounces it based on delay setting.
  //event = the input change event
  const handleChange = (event) => {
    const newValue = event.target.value;

    // Update local state immediately for responsive typing
    setInputValue(newValue);

    // Choose between debounced or immediate parent callback
    if (onChangeDebounceDelay > 0) {
      debouncedOnChange(newValue);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Col>
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </Col>
  );
}
