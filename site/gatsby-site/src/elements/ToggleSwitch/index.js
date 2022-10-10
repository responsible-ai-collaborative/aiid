import React from 'react';

export default function ToggleSwitch({
  checked = false,
  disabled = false,
  label = undefined,
  name = '',
  onChange,
}) {
  const toggle = () => onChange(!checked);

  const handleClick = (event) => {
    if (!disabled) {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <>
      <button onClick={handleClick}>
        <label
          htmlFor={`${name}-toggle`}
          className="inline-flex relative items-center mb-4 cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id={`${name}-toggle`}
            className="sr-only peer"
            checked={checked ? 'checked' : ''}
            disabled={disabled}
          ></input>
          <div
            className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}
          ></div>
          {label && <span className="ml-3">{label}</span>}
        </label>
      </button>
    </>
  );
}
