import SearchInput from 'components/forms/SearchInput';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import Button from '../../elements/Button';
import Card from '../../elements/Card';
import Col from '../../elements/Col';
import Row from '../../elements/Row';
import Form from '../../elements/Form';
import { Trans, useTranslation } from 'react-i18next';

export default function QuickSearch({ className }) {
  const [searchTerm, setSearchTerm] = useState('');

  const [searchPlaceholder, setSearchPlaceholder] = useState('');

  const setInnerText = () => {
    const width = window.innerWidth;

    if (width >= 350 && width < 450) {
      setSearchPlaceholder(t('Search 1600+ reports'));
    } else if (width >= 450 && width < 500) {
      setSearchPlaceholder(t('Search 1600+ AI harm reports'));
    } else if (width >= 500) {
      setSearchPlaceholder(t('Search over 1600 reports of AI harms'));
    } else {
      setSearchPlaceholder(t('Search reports'));
    }
  };

  useEffect(() => {
    setInnerText();
    window.addEventListener('resize', setInnerText);

    return () => {
      window.removeEventListener('resize', setInnerText);
    };
  }, []);

  const localizePath = useLocalizePath();

  const submit = (e) => {
    e.preventDefault();
    navigate(localizePath({ path: `/apps/discover?s=${searchTerm}` }));
  };

  const discover = (e) => {
    e.preventDefault();
    navigate(localizePath({ path: `/apps/discover` }));
  };

  const { t } = useTranslation(['translation', 'landing', 'actions']);

  return (
    <>
      <Card className={className}>
        <Card.Body>
          <Form onSubmit={submit} id="quickSearch" className="flex-1">
            <div
              className={`${
                searchTerm == '' ? '' : 'has-input'
              } relative max-w-screen-sm m-auto after:text-dark-gray after:text-xl after:absolute after:left-[1em] after:top-1/2 after:pt-[-50%] after:translate-y-[-50%] after:z-[3] after:pointer-events-none after:content-[attr(data-content)]`}
            >
              <SearchInput
                size="lg"
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeHolder={searchPlaceholder}
                onKeyPress={(e) => {
                  e.key === 'Enter' && submit(e);
                }}
                aria-label={t('Search over 1600 reports of AI harms')}
              />
            </div>
            <Row>
              <Col className="flex gap-2 justify-center">
                <Button size="lg" variant="primary" className="mt-4" type="submit">
                  <Trans>Search</Trans>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4"
                  type="button"
                  onClick={discover}
                >
                  <Trans>Discover</Trans>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
