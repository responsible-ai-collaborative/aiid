import React, { Fragment } from 'react';
import Link from 'components/ui/Link';
import { Trans } from 'react-i18next';

function EntityBadge({ entity }) {
  const to = `/entities/${entity.id}`;

  return (
    <Link
      to={to}
      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5 my-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
    >
      {entity.name}
    </Link>
  );
}

function PartyBadge({ entity }) {
  const to = `/entities/${entity.id}`;

  return (
    <Link
      to={to}
      className="inline-block bg-green-100 text-green-800 text-xs font-semibold whitespace-nowrap px-2.5 py-0.5 my-0.5 rounded dark:bg-green-200 dark:text-green-800"
    >
      {entity.name}
    </Link>
  );
}

function EntitiesList({ entities }) {
  return entities.map((d, i) => (
    <Fragment key={d.id}>
      {i > 0 && <> {i < entities.length - 1 ? <>,</> : <Trans>and</Trans>} </>}
      <EntityBadge entity={d} />
    </Fragment>
  ));
}

function PartiesList({ entities }) {
  return entities.map((entity, i) => (
    <Fragment key={entity.id}>
      {i > 0 && <> {i < entities.length - 1 ? <>,</> : <Trans>and</Trans>} </>}
      <PartyBadge entity={entity} />
    </Fragment>
  ));
}

export default function AllegedEntities({ entities }) {
  const entitiesHarming = entities.filter((e) => e.harmedEntities.length > 0);

  const entitiesHarmed = entities.filter((e) => e.incidentsHarmedBy.length > 0);

  if (
    entitiesHarming.every(
      (e) => e.incidentsAsDeveloper.length == 0 && e.incidentsAsDeployer.length === 0
    )
  ) {
    return (
      <Trans ns="entities">
        Alleged:{' '}
        <EntitiesList entities={entitiesHarming.length ? entitiesHarming : entitiesHarmed} />{' '}
        developed and deployed an AI system, which harmed <PartiesList entities={entitiesHarmed} />.
      </Trans>
    );
  }

  const deployers = entitiesHarming.filter(
    (e) => e.incidentsAsDeployer.length > 0 || e.incidentsAsBoth.length > 0
  );

  const developers = entitiesHarming.filter(
    (e) => e.incidentsAsDeveloper.length > 0 || e.incidentsAsBoth.length > 0
  );

  return (
    <Trans ns="entities">
      Alleged: <EntitiesList entities={developers} /> developed an AI system deployed by{' '}
      <EntitiesList entities={deployers} />, which harmed <PartiesList entities={entitiesHarmed} />.
    </Trans>
  );
}
