import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">AIID Button Embed Examples</h1>

        <section className="w-full space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Example 1: Embed by Incident ID</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This example shows how to embed a link to a specific incident using its ID.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {`<div
  class="aiid-embed"
  data-incident-id="1"
></div>
<script async src="https://pr-3488--staging-aiid.netlify.app/embed.js"></script>`}
              </pre>
              <div className="mt-4">
                <div
                  className="aiid-embed"
                  data-incident-id="1"
                ></div>
                <script async src="https://pr-3488--staging-aiid.netlify.app/embed.js"></script>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Example 2: Embed by Report URL</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This example shows how to embed links to incidents by providing a report URL.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {`<div
  class="aiid-embed"
  data-report-url="https://cofense.com/blog/clickbait-to-catastrophe-how-a-fake-meta-email-leads-to-password-plunder"
></div>
<script async src="https://pr-3488--staging-aiid.netlify.app/embed.js"></script>`}
              </pre>
              <div className="mt-4">
                <div
                  className="aiid-embed"
                  data-report-url="https://cofense.com/blog/clickbait-to-catastrophe-how-a-fake-meta-email-leads-to-password-plunder"
                ></div>
                <script async src="https://pr-3488--staging-aiid.netlify.app/embed.js"></script>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
