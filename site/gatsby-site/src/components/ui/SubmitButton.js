import React from 'react';
import { Button, Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';

export default function SubmitButton({ disabled, loading, onClick, ...props }) {
  return (
    <Button disabled={disabled || loading} onClick={onClick} {...props}>
      <div className="flex gap-2 items-center">
        {loading && (
          <div>
            <Spinner size="sm" />
          </div>
        )}
        <Trans>Submit</Trans>
      </div>
    </Button>
  );
}
