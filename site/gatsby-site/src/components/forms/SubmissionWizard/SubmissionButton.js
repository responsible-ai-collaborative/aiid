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
              "Once you submit this form, you won't be able to make changes. Are you sure you want to submit?"
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
