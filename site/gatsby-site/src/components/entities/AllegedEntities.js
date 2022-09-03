import React from 'react';
import Link from 'components/ui/Link';
import { Trans } from 'react-i18next';

function EntityBadge({ entity }) {
  const to = `/entities/${entity.id}`;

  return (
    <Link
      to={to}
      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
    >
      {entity.name}
    </Link>
  );
}

function PartyBadge({ text }) {
  return (
    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800">
      {text}
    </span>
  );
}

function EntitiesList({ entities }) {
  return entities.map((d, i) => (
    <>
      {i > 0 && <> {i < entities.length - 1 ? <>, </> : <> and </>} </>}
      <EntityBadge key={d.id} entity={d} />
    </>
  ));
}

function PartiesList({ parties }) {
  return parties.map((p, i) => (
    <>
      {i > 0 && <> {i < parties.length - 1 ? <>, </> : <> and </>} </>}
      <PartyBadge text={p} />
    </>
  ));
}

export default function AllegedEntities({ incident, entities }) {
  if (entities.incidentsAsDeployer.length === 0 && entities.incidentsAsDeveloper === 0) {
    const [entity] = entities;

    return (
      <div>
        <Trans>
          Alleged: <EntityBadge entity={entity} /> developed and deployed an AI system, which harmed{' '}
          <PartiesList parties={incident.Alleged_harmed_or_nearly_harmed_parties} />.
        </Trans>
      </div>
    );
  }

  const deployers = entities.filter((e) => e.incidentsAsDeployer.length > 0);

  const developers = entities.filter((e) => e.incidentsAsDeveloper.length > 0);

  return (
    <div>
      <Trans>
        Alleged: <EntitiesList entities={developers} /> developed an AI system deployed by{' '}
        <EntitiesList entities={deployers} />, which harmed{' '}
        <PartiesList parties={incident.Alleged_harmed_or_nearly_harmed_parties} />.
      </Trans>
    </div>
  );
}
