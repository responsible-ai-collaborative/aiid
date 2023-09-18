import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function EditableLabel({ title, onChange, textClasses, iconClasses }) {
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <span className="inline-flex shrink flex-nowrap items-center">
      {editingTitle ? (
        <input
          type="text"
          value={title}
          onChange={onChange}
          onBlur={() => setEditingTitle(false)}
          className={`${textClasses} py-0 border-none flex-shrink-1`}
        />
      ) : (
        <span className={`${textClasses} bg-white`}>{title}</span>
      )}
      <button
        className="px-2"
        onClick={() => setEditingTitle((editingTitle) => !editingTitle)}
      >
        <FontAwesomeIcon
          className={`${iconClasses} align-baseline`}
          icon={editingTitle ? faCheck : faEdit}
        />
      </button>
    </span>
  );
}