import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

const EditableLabel = (props) => {
  const { title, onChange, textClasses, iconClasses, disabled } = props;

  const [displayTitle, setDisplayTitle] = useState(title);

  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <span data-cy={props['data-cy']} className="inline-flex shrink flex-nowrap items-center">
      {editingTitle ? (
        <input
          type="text"
          value={displayTitle}
          onChange={(evt) => {
            setDisplayTitle(evt.target.value);
            onChange(evt);
          }}
          onBlur={() => setEditingTitle(false)}
          className={`${textClasses} py-0 border-none flex-shrink-1`}
        />
      ) : (
        <span data-cy="risk-title-no-edit" className={`${textClasses} bg-white`}>
          {displayTitle}
        </span>
      )}
      {!disabled && (
        <button
          data-cy="edit-button"
          className="px-2"
          onClick={() => setEditingTitle((editingTitle) => !editingTitle)}
        >
          <FontAwesomeIcon
            className={`${iconClasses || ''} align-baseline`}
            icon={editingTitle ? faCheck : faEdit}
          />
        </button>
      )}
    </span>
  );
};

export default EditableLabel;
