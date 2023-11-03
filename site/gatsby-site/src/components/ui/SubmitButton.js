import React from 'react';
import { Button, Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';

export default function SubmitButton({ disabled, loading, onClick, children, ...props }) {
  return (
    <Button data-cy="submit-button" disabled={disabled || loading} onClick={onClick} {...props}>
      <div className="flex gap-2 items-center">
        {loading && (
          <div>
            <Spinner size="sm" />
          </div>
        )}
        <Trans>{children}</Trans>
      </div>
    </Button>
  );
}
