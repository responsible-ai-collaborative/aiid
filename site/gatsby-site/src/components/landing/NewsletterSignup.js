import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Card from 'elements/Card';
import Envelope from '../../images/neural-net-envelope.png';
import Link from 'components/ui/Link';
import { useUserContext } from 'contexts/UserContext';

export default function NewsletterSignup() {
  const { t } = useTranslation();

  const { user } = useUserContext();

  return (
    <Card className="h-full w-full self-stretch flex justify-center shadow-md">
      <h5 className="text-2xl font-bold tracking-tight p-4 pb-2 text-gray-900 dark:text-white">
        <Trans ns="landing">The AI Incident Briefing</Trans>
      </h5>
      <div className="h-full flex-shrink flex flex-col items-center justify-center p-8 bg-[#e1effe]">
        <Link to="/signup">
          <img
            src={Envelope}
            alt={t('An envelope with a neural net diagram on its left')}
            className="w-2/5 mx-auto drop-shadow-xl mb-6"
          />
        </Link>
        {user ? (
          <p>
            <Trans ns="login">
              <Link to="/account?receiveAIBriefing=true">Subscribe</Link> to the &quot;AI Incident
              Briefing&quot; and receive weekly notifications about new incidents and other updates.
            </Trans>
          </p>
        ) : (
          <p>
            <Trans ns="login">
              <Link to="/signup">Create an account</Link> to subscribe to new incident notifications
              and other updates.
            </Trans>
          </p>
        )}
      </div>
    </Card>
  );
}
