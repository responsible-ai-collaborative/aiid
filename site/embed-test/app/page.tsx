import Script from 'next/script';

interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

// The Page component now receives searchParams as a prop
export default function Home({ searchParams }: HomePageProps) {
  const baseUrl = searchParams?.embedBaseURL;

  if (typeof baseUrl !== 'string' || !baseUrl) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
        <p className="text-center">
          The <code className="bg-gray-800 px-1 rounded">embedBaseURL</code> query parameter is required and must be a single string.
        </p>
        <p className="text-center mt-2">
          Please append <code className="bg-gray-800 px-1 rounded">?embedBaseURL=https://your-script-domain.com</code> to the URL.
        </p>
      </div>
    );
  }

  const scriptSrc = `${baseUrl}/embed.js`;

  console.log(`Rendering embed script server-side from: ${scriptSrc}`);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-300">AIID Embed Test Page (Server Rendered)</h1>
      <p className="text-center text-sm text-gray-400 mb-4">
        Loading embed script from: <code className="bg-gray-800 px-1 rounded">{scriptSrc}</code>
      </p>
      <p className="text-center text-sm text-gray-400 mb-8">
        (Determined server-side by required <code className="bg-gray-800 px-1 rounded">?embedBaseURL=</code> query parameter)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Embed by Incident ID */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md" suppressHydrationWarning={true}>
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Embed by Incident ID (ID: 1)</h2>
          <p className="text-sm text-gray-400 mb-2">Embed Code (uses detected base URL):</p>
          <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto text-gray-300">
            {`<div
  class="aiid-embed"
  data-incident-id="1"
></div>
<script async src="${scriptSrc}"></script>`} 
          </pre>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Rendered Embed:</p>
            <div
              className="aiid-embed"
              data-incident-id="1"
              suppressHydrationWarning={true}
            ></div>
          </div>
        </div>

        {/* Card 2: Embed by Report URL */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md" suppressHydrationWarning={true}>
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Embed by Report URL</h2>
          <p className="text-sm text-gray-400 mb-2">Embed Code (uses detected base URL):</p>
          <pre className="bg-gray-700 p-3 rounded text-sm overflow-x-auto text-gray-300">
            {`<div
  class="aiid-embed"
  data-report-url="https://cofense.com/blog/clickbait-to-catastrophe-how-a-fake-meta-email-leads-to-password-plunder"
></div>
<script async src="${scriptSrc}"></script>`} 
          </pre>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Rendered Embed:</p>
            <div
              className="aiid-embed"
              data-report-url="https://cofense.com/blog/clickbait-to-catastrophe-how-a-fake-meta-email-leads-to-password-plunder"
            ></div>
          </div>
        </div>
      </div>

      <Script 
        id="aiid-embed-script"
        src={scriptSrc}
        strategy="afterInteractive"
      />

    </div>
  );
}