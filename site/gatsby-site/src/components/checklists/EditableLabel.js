import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function EditableLabel({ title, onChange, textClasses }) {
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <span className="inline-flex flex-shrink-1 flex-nowrap">
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
        className="bg-white px-2"
        onClick={() => setEditingTitle((editingTitle) => !editingTitle)}
      >
        <FontAwesomeIcon icon={editingTitle ? faCheck : faEdit} />
      </button>
    </span>
  );
}
