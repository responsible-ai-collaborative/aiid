/**
 * Subscription types used by the notification system
 * @readonly
 * @enum {string}
 */
export const SUBSCRIPTION_TYPE = {
  /** All: This subscription type is not defined yet. */
  all: 'all',
  /** Incident: Users with this subscription type will be notified
   * when the incident associated is updated.
   * This subscription type needs an incident_id value associated. */
  incident: 'incident',
  /** New Incident: Users with this subscription type will be notified
   * when a new Incident is created. */
  newIncidents: 'new-incidents',
  /** Entitys: Users can subscribe to an specific Entity.
   * The user with this subscription type will be notified when a
   * new Incident associated with an specific Entity is created or
   * when an existing Incident is updated to be associated with that Entity. */
  entity: 'entity',
};
