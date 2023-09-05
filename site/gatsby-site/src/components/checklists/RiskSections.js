import React, { useEffect, useState } from 'react';
import { Form } from 'formik';
import { Button, Textarea, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useExpanded, useFilters, usePagination, useSortBy, useTable } from 'react-table';

import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { DELETE_CHECKLIST } from '../../graphql/checklists';
import { classy, classyDiv } from 'utils/classy';
import { Label, DeleteButton, abbreviatedTag, emptyRisk, shouldBeGrouped, risksEqual } from 'utils/checklists';
import Tags from 'components/forms/Tags';
import RiskSection from 'components/checklists/RiskSection';
import EditableLabel from 'components/checklists/EditableLabel';
import ExportDropdown from 'components/checklists/ExportDropdown';

export default function RiskSections({
  risks,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
  risksLoading,
  removeRisk,
  changeSort,
  updateRisk
}) {

  const riskSectionProps = {
    setFieldValue,
    submitForm,
    tags,
    searchTags,
    allPrecedents,
    removeRisk,
    changeSort,
    updateRisk,
  };


  return (
    <div className="flex flex-col gap-8 mt-8">
      {risksLoading ? ( 
        <>
          {(risks || []).filter(risk => !risk.generated).map((risk) => (
            <RiskSection key={risk.id} {...{...riskSectionProps, risk}} />
          ))}
          <div className="flex flex-row">
            <Spinner />{' '}
            <Trans>Searching for risks matching tags…</Trans>
          </div>
        </>
      ) : (
        (risks || []).map((risk) => (
          <RiskSection key={risk.id} {...{...riskSectionProps, risk}} />
        ))
      )}
    </div>
  );
}
