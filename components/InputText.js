import { useState, useCallback } from 'react';
import { Col } from 'react-bootstrap';

export default function InputText({
  id,
  placeholder,
  onChange,
  onChangeDebounceDelay = 0,
}) {
  const [inputValue, setInputValue] = useState('');
 
  const debouncedOnChange = useCallback(
    (value) => {
      const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      };

      const debouncedFunc = debounce((val) => {
        if (onChange) {
          onChange(val);
        }
      }, onChangeDebounceDelay);

      debouncedFunc(value);
    },
    [onChange, onChangeDebounceDelay]
  );

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
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
