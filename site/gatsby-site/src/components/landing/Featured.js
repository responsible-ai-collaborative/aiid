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
          Read about the database at{' '}
          <a href="https://time.com/7346091/ai-harm-risk/" target="_blank" rel="noreferrer">
            Time Magazine
          </a>
          ,{' '}
          <a
            href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
            target="_blank"
                     >
            Vice News
          </a>
          ,{' '}
          <a
            href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
            target="_blank"
                     >
            Venture Beat
          </a>
          ,{' '}
          <a
            href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
            target="_blank"
                     >
            Wired
          </a>
          ,{' '}
          <a
            href="https://thebulletin.org/2026/01/what-experts-can-learn-by-tracking-ai-harms/"
            target="_blank"
                     >
            Bulletin of the Atomic Scientists
          </a>
          ,{' '}
          <a
            href="https://hai.stanford.edu/ai-index/2025-ai-index-report"
            target="_blank"
                     >
            Stanford AI Index
          </a>
          ,{' '}
          <a
            href="https://www.rollingstone.com/culture/culture-features/ai-deepfakes-creators-fight-back-1235535955/"
            target="_blank"
                     >
            Rolling Stone
          </a>
          ,{' '}
          <a
            href="https://www.theguardian.com/technology/2026/feb/06/deepfake-taking-place-on-an-industrial-scale-study-finds"
            target="_blank"
                     >
            the Guardian
          </a>
          ,{' '}
          <a
            href="https://hbr.org/2026/03/ai-agents-act-a-lot-like-malware-heres-how-to-contain-the-risks"
            target="_blank"
                     >
            Harvard Business Review
          </a>
          ,{' '}
          <a
            href="https://www.brasilemfolhas.com.br/2026/02/fraudes-com-deepfake-se-tornam-comuns-em-escala-industrial-alertam-especialistas/"
            target="_blank"
                     >
            Brasil em Folhas
          </a>
          ,{' '}
          <a
            href="https://www.newsweek.com/ai-accidents-set-skyrocket-this-year-1795928"
            target="_blank"
                     >
            Newsweek
          </a>
          , and other outlets.
        </Trans>
      </p>

      <div className="items-center justify-center flex flex-wrap gap-4">
        <a
          href="https://arxiv.org/abs/2011.08512"
          target="_blank"
                   className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/arxiv.png" alt="Arxiv Logo" loading="lazy" />
        </a>
        <a
          href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
          target="_blank"
                   className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/VentureBeat.png" alt="Venture Beat Logo" loading="lazy" />
        </a>
        <a
          href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
          target="_blank"
                   className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/Wired_logo.svg" alt="Wired Logo" loading="lazy" />
        </a>
        <a
          href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
          target="_blank"
                   className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/vice.png" alt="Vice logo" loading="lazy" />
        </a>
        <a
          href="https://www.newsweek.com/ai-accidents-set-skyrocket-this-year-1795928"
          target="_blank"
                   className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/newsweek.svg" alt="Newsweek logo" loading="lazy" />
        </a>
        <a
          href="https://time.com/7346091/ai-harm-risk/"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/time.svg" alt="Time logo" loading="lazy" />
        </a>
        <a
          href="https://thebulletin.org/2026/01/what-experts-can-learn-by-tracking-ai-harms/"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/bulletin-atomic-scientists.svg" alt="Bulletin of the Atomic Scientists logo" loading="lazy" />
        </a>
        <a
          href="https://hai.stanford.edu/ai-index/2025-ai-index-report"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/stanford-hai.svg" alt="Stanford HAI logo" loading="lazy" />
        </a>
        <a
          href="https://www.rollingstone.com/culture/culture-features/ai-deepfakes-creators-fight-back-1235535955/"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/rolling-stone.svg" alt="Rolling Stone logo" loading="lazy" />
        </a>
        <a
          href="https://www.theguardian.com/technology/2026/feb/06/deepfake-taking-place-on-an-industrial-scale-study-finds"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/the-guardian.svg" alt="The Guardian logo" loading="lazy" />
        </a>
        <a
          href="https://hbr.org/2026/03/ai-agents-act-a-lot-like-malware-heres-how-to-contain-the-risks"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/hbr.svg" alt="Harvard Business Review logo" loading="lazy" />
        </a>
        <a
          href="https://www.brasilemfolhas.com.br/2026/02/fraudes-com-deepfake-se-tornam-comuns-em-escala-industrial-alertam-especialistas/"
          target="_blank"
          className="flex justify-center items-center min-w-[5rem] max-w-[10rem] flex-1"
        >
          <img src="/images/news/brasil-em-folhas.svg" alt="Brasil em Folhas logo" loading="lazy" />
        </a>
      </div>
    </Card>
  );
}
