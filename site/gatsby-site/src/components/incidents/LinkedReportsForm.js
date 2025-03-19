import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Button } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faEdit, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Tags from '../forms/Tags';
import { useMutation } from '@apollo/client';
import { UPDATE_REPORT } from '../../graphql/reports';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { isCompleteReport } from '../../utils/variants';
import { getUnixTime } from 'date-fns';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import Label from 'components/forms/Label';

function LinkedReportsForm({ reports }) {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [editingReportTags, setEditingReportTags] = useState(null);

  const [reportTags, setReportTags] = useState({});

  const [originalTags, setOriginalTags] = useState({});

  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (reports) {
      const tags = new Set();

      reports.forEach((report) => {
        if (report.tags) {
          report.tags.forEach((tag) => tags.add(tag));
        }
      });

      setAllTags(Array.from(tags));

      const tagsMap = {};

      reports.forEach((report) => {
        tagsMap[report.report_number] = Array.isArray(report.tags) ? [...report.tags] : [];
      });
      setReportTags(tagsMap);
    }
  }, [reports]);

  const handleUpdateReportTags = async (reportNumber, newTags) => {
    try {
      const processedTags = newTags.map((tag) =>
        typeof tag === 'object' && tag.label ? tag.label : tag
      );

      await updateReport({
        variables: {
          filter: {
            report_number: { EQ: reportNumber },
          },
          update: {
            set: {
              tags: processedTags,
              epoch_date_modified: getUnixTime(new Date()),
            },
          },
        },
      });

      setReportTags({
        ...reportTags,
        [reportNumber]: processedTags,
      });

      if (reports) {
        reports.forEach((report) => {
          if (report.report_number === reportNumber) {
            report.tags = processedTags;
          }
        });
      }

      setEditingReportTags(null);

      addToast({
        message: t('Tags updated successfully'),
        severity: SEVERITY.success,
      });
    } catch (error) {
      addToast({
        message: t('Error updating tags: {{message}}', { message: error.message }),
        severity: SEVERITY.danger,
        error,
      });
    }
  };

  if (!reports || reports.length === 0 || Object.keys(reportTags).length === 0) {
    return null;
  }

  return (
    <FieldContainer>
      <Label label={t('Linked Reports')} popover="linkedReports" />
      <div className="mt-2 space-y-4">
        {reports
          .filter((r) => isCompleteReport(r))
          .map((report) => {
            return (
              <div
                key={report.report_number}
                className="border rounded-lg p-4 bg-gray-50"
                data-testid={`linked-report-${report.report_number}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <p className="text-md text-gray-500 m-0">#{report.report_number}</p>
                    <h4 className="text-base font-medium m-0">
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 flex items-center text-base"
                      >
                        {report.title}
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-xs" />
                      </a>
                    </h4>
                  </div>
                  <a
                    href={`/cite/edit?report_number=${report.report_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    {t('Edit Report')}
                  </a>
                </div>

                <div className="mt-3">
                  <div className="flex items-center mb-2">
                    <FontAwesomeIcon fixedWidth icon={faTag} title={t('Tags')} className="mr-2" />
                    <span className="font-medium">{t('Tags')}:</span>
                  </div>

                  {editingReportTags === report.report_number ? (
                    <div className="mt-2">
                      <div>
                        <Tags
                          key={`report-tags-${report.report_number}`}
                          id={`report-tags-${report.report_number}`}
                          className="Typeahead"
                          allowNew
                          placeHolder={t('Choose or add tags...')}
                          options={allTags}
                          value={reportTags[report.report_number] || []}
                          onChange={(value) => {
                            const processedTags = value.map((tag) =>
                              typeof tag === 'object' && tag.label ? tag.label : tag
                            );

                            setReportTags({
                              ...reportTags,
                              [report.report_number]: processedTags,
                            });
                          }}
                        />
                      </div>
                      <div className="flex mt-2 space-x-2">
                        <Button
                          size="xs"
                          onClick={() =>
                            handleUpdateReportTags(
                              report.report_number,
                              reportTags[report.report_number]
                            )
                          }
                        >
                          {t('Save')}
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => {
                            if (originalTags[report.report_number]) {
                              setReportTags({
                                ...reportTags,
                                [report.report_number]: [...originalTags[report.report_number]],
                              });
                            }
                            setEditingReportTags(null);
                          }}
                        >
                          {t('Cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1 items-center">
                      {reportTags[report.report_number] &&
                      reportTags[report.report_number].length > 0 ? (
                        reportTags[report.report_number].map((tag, index) => (
                          <Badge key={index} color="info" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">{t('No tags')}</span>
                      )}
                      {editingReportTags !== report.report_number && (
                        <Button
                          size="xs"
                          color="light"
                          className="ml-2"
                          onClick={() => {
                            setOriginalTags({
                              ...originalTags,
                              [report.report_number]: [...(reportTags[report.report_number] || [])],
                            });
                            setEditingReportTags(report.report_number);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          {t('Edit')}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </FieldContainer>
  );
}

export default LinkedReportsForm;
