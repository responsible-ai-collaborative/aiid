import React from 'react';
import { Button, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';

const SubmissionButton = ({ onClick, ...props }) => {
  const { t } = useTranslation('submit');

  return (
    <Button
      onClick={() => {
        if (
          confirm(
            t(
              'Please confirm you are ready to submit this report. Report details cannot be changed after submission.'
            )
          )
        ) {
          onClick();
        }
      }}
      {...props}
    >
      {props.isSubmitting && (
        <div className="mr-3">
          <Spinner size="sm" light={true} />
        </div>
      )}
      <Trans>Submit</Trans>
    </Button>
  );
};

export default SubmissionButton;
