import React from 'react';
import { Script } from 'gatsby';
import { useQuery } from '@apollo/client';
import { FIND_REPORT } from '../graphql/reports';
import config from '../../config';
import { Spinner } from 'flowbite-react';

const EmbedsPage = () => {
  // Fetch the first report to get a real URL for the example
  const { data: reportData, loading } = useQuery(FIND_REPORT, {
    variables: {
      filter: {
        report_number: { EQ: 1 },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AIID Embed Examples</h1>

      <div className="space-y-8">
        {/* Example 1: Using Incident ID */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Example 1: Embed by Incident ID</h2>
          <p className="mb-4">
            This example shows how to embed a link to a specific incident using its ID.
          </p>

          <div className="bg-gray-100 p-4 rounded mb-4">
            <pre className="whitespace-pre-wrap">
              {`<div
  class="aiid-embed"
  data-incident-id="1"
></div>
<script async src="${config.gatsby.siteUrl}/embed.js"></script>`}
            </pre>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <div className="aiid-embed" data-incident-id="1"></div>
          </div>
          <Script id="aiid-embed-1" src="/embed.js" />
        </section>

        {/* Example 2: Using Report URL */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Example 2: Embed by Report URL</h2>
          <p className="mb-4">
            This example shows how to embed links to incidents by providing a report URL.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : reportData?.report?.url ? (
            <>
              <div className="bg-gray-100 p-4 rounded mb-4">
                <pre className="whitespace-pre-wrap">
                  {`<div
  class="aiid-embed"
  data-report-url="${reportData.report.url}"
></div>
<script async src="${config.gatsby.siteUrl}/embed.js"></script>`}
                </pre>
              </div>

              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">Result:</h3>
                <div className="aiid-embed" data-report-url={reportData.report.url}></div>
              </div>
              <Script id="aiid-embed-2" src="/embed.js" />
            </>
          ) : (
            <div className="text-gray-500">No report URL available</div>
          )}
        </section>

        {/* Usage Instructions */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <div className="prose max-w-none">
            <p>To embed AIID links on your website:</p>
            <ol>
              <li>
                Choose whether you want to link to a specific incident (using incident ID) or find
                incidents by report URL
              </li>
              <li>Copy the appropriate HTML snippet from above</li>
              <li>
                Replace the placeholder values:
                <ul>
                  <li>
                    For incident ID: Replace <code>123</code> with your incident ID
                  </li>
                  {!loading && reportData?.report?.url && (
                    <li>
                      For report URL: Replace <code>{reportData.report.url}</code> with your report
                      URL
                    </li>
                  )}
                </ul>
              </li>
              <li>Paste the snippet into your webpage</li>
            </ol>
            <p>The script will automatically:</p>
            <ul>
              <li>Load the necessary data</li>
              <li>Find matching incidents (if using report URL)</li>
              <li>Display one or more &ldquo;See it on the AIID #X&rdquo; buttons</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmbedsPage;
