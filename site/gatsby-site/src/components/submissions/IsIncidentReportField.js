const { Field } = require('formik');

const React = require('react');

export default function IsIncidentReportField({ className = '' }) {
  return (
    <Field name="is_incident_report">
      {({ field, form }) => {
        return (
          <div
            className={`flex ${className}`}
            role="group"
            aria-labelledby="my-radio-group"
            onChange={(e) => form.setFieldValue(field.name, e.target.value === 'true')}
          >
            <div className="flex items-center mr-4">
              <input
                id="incident-radio"
                style={{ appearance: 'auto' }}
                type="radio"
                name={field.name}
                value="true"
                checked={field.value}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="incident-radio"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Incident
              </label>
            </div>
            <div className="flex items-center mr-4">
              <input
                id="issue-radio"
                style={{ appearance: 'auto' }}
                type="radio"
                name={field.name}
                value="false"
                checked={!field.value}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="issue-radio"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Issue
              </label>
            </div>
          </div>
        );
      }}
    </Field>
  );
}
