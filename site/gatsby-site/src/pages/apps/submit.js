import React, { useEffect } from 'react';
import SubmitForm from 'components/forms/SubmitForm';
import AiidHelmet from 'components/AiidHelmet';
import { useTranslation } from 'react-i18next';
import { useMenuContext } from 'contexts/MenuContext';
import { useLayoutContext } from 'contexts/LayoutContext';

const SubmitPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation(['submit']);

  const { isCollapsed, collapseMenu } = useMenuContext();

  const { setClassName } = useLayoutContext();

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
    setClassName('md:max-w-5xl');
  }, []);

  return (
    <>
      <AiidHelmet path={pathname}>
        <title>{t('New Incident Report')}</title>
      </AiidHelmet>
      <SubmitForm />
    </>
  );
};

export default SubmitPage;
