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
};
