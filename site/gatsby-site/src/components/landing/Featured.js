import { Card } from 'flowbite-react';
import React from 'react';
import { Trans } from 'react-i18next';

export default function Featured() {
  return (
    <Card>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white w-full text-center">
        <Trans ns="landing">The Database in Print</Trans>
      </h5>
      <p className="mb-5 text-base text-gray-500 dark:text-gray-400 sm:text-lg text-center">
        <Trans i18nKey="readAboutTheDatabase" ns="landing">
          Read about the database on the{' '}
          <a
            href="https://www.partnershiponai.org/aiincidentdatabase/"
            target="_blank"
            rel="noreferrer"
          >
            PAI Blog
          </a>
          ,{' '}
          <a
            href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
            target="_blank"
            rel="noreferrer"
          >
            Vice News
          </a>
          ,{' '}
          <a
            href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
            target="_blank"
            rel="noreferrer"
          >
            Venture Beat
          </a>
          ,{' '}
          <a
            href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
            target="_blank"
            rel="noreferrer"
          >
            Wired
          </a>
          , and{' '}
          <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
            arXiv
          </a>{' '}
          among other outlets.
        </Trans>
      </p>

      <div className="items-center justify-center flex flex-wrap gap-4">
        <a
          href="https://arxiv.org/abs/2011.08512"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center max-w-[10rem] flex-1"
        >
          <img src="/images/news/arxiv.png" alt="Arxiv Logo" />
        </a>
        <a
          href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center max-w-[10rem] flex-1"
        >
          <img src="/images/news/VentureBeat.png" alt="Venture Beat Logo" />
        </a>
        <a
          href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center max-w-[10rem] flex-1"
        >
          <img src="/images/news/Wired_logo.svg" alt="Wired Logo" />
        </a>
        <a
          href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center max-w-[10rem] flex-1"
        >
          <img src="/images/news/vice.png" alt="Vice logo" />
        </a>
      </div>
    </Card>
  );
}
