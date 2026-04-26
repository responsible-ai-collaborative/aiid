import { UserCacheManager } from "../../server/fields/userCacheManager";
import config from "../../server/config";
import { Context, DBEntity, DBIncident, DBNotification, DBReport, DBSubscription, NotificationTypes } from "../../server/interfaces";
import { Collection, MongoClient } from "mongodb";
import { SendBulkEmailParams, sendBulkEmails } from "../../server/emails";
import { markNotificationsAsProcessed, markNotificationsAsNotProcessed } from '../utils/notificationUtils';

const buildEntityList = (allEntities: DBEntity[], entityIds: string[] = []) => {
    const entityNames = entityIds.map((entityId: string) => {
        const entity = allEntities.find((entity) => entity.entity_id === entityId);
        return entity ? `<a href="${config.SITE_URL}/entities/${entity.entity_id}">${entity.name}</a>` : '';
    });

    if (entityNames.length < 3) { return entityNames.join(' and '); }

    return `${entityNames.slice(0, - 1).join(', ')}, and ${entityNames[entityNames.length - 1]}`;
}

interface NewIncidentEntry {
    incidentId: string;
    incidentTitle: string;
    incidentUrl: string;
    incidentDescription?: string;
    incidentDate?: string;
    developers: string;
    deployers: string;
    entitiesHarmed: string;
    implicatedSystems: string;
}

interface EntityEventEntry extends NewIncidentEntry {
    entityName: string;
    entityUrl: string;
    isUpdate: boolean;
}

interface IncidentUpdateEntry {
    incidentId: string;
    incidentTitle: string;
    incidentUrl: string;
    reportUrl?: string;
    reportTitle?: string;
    reportAuthor?: string;
}

interface SubmissionPromotedEntry {
    incidentId: string;
    incidentTitle: string;
    incidentUrl: string;
    incidentDescription?: string;
    incidentDate?: string;
}

interface UserDigest {
    newIncidents: NewIncidentEntry[];
    entityEvents: EntityEventEntry[];
    incidentUpdates: IncidentUpdateEntry[];
    submissionsPromoted: SubmissionPromotedEntry[];
}

const emptyDigest = (): UserDigest => ({
    newIncidents: [],
    entityEvents: [],
    incidentUpdates: [],
    submissionsPromoted: [],
});

const incidentToNewIncidentEntry = (incident: DBIncident, allEntities: DBEntity[]): NewIncidentEntry => ({
    incidentId: `${incident.incident_id}`,
    incidentTitle: incident.title,
    incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
    incidentDescription: incident.description ?? undefined,
    incidentDate: incident.date,
    developers: buildEntityList(allEntities, incident['Alleged developer of AI system']),
    deployers: buildEntityList(allEntities, incident['Alleged deployer of AI system']),
    entitiesHarmed: buildEntityList(allEntities, incident['Alleged harmed or nearly harmed parties']),
    implicatedSystems: buildEntityList(allEntities, incident.implicated_systems),
});

export const processNotifications = async () => {

    const userCacheManager = new UserCacheManager();

    userCacheManager.clearUsersCache();

    const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING);

    const context: Context = { client, user: null, req: {} as any };

    const notificationsCollection: Collection<DBNotification> = context.client.db('customData').collection<DBNotification>("notifications");
    const subscriptionsCollection = context.client.db('customData').collection<DBSubscription>("subscriptions");
    const incidentsCollection = context.client.db('aiidprod').collection<DBIncident>("incidents");
    const entitiesCollection = context.client.db('aiidprod').collection<DBEntity>("entities");
    const reportsCollection = context.client.db('aiidprod').collection<DBReport>("reports");

    const targetTypes: NotificationTypes[] = ['new-incidents', 'entity', 'new-report-incident', 'incident-updated', 'submission-promoted'];

    const pendingNotifications = await notificationsCollection.find({
        processed: false,
        type: { $in: targetTypes },
    }).toArray();

    if (pendingNotifications.length === 0) {
        console.log('Process Pending Notifications: No pending notifications to process.');
        return 0;
    }

    // Resolve everything we'll need up-front so the per-user loop is pure aggregation.
    const incidentIds = [...new Set(
        pendingNotifications.map(n => n.incident_id).filter((id): id is number => typeof id === 'number')
    )];
    const reportNumbers = [...new Set(
        pendingNotifications.map(n => n.report_number).filter((n): n is number => typeof n === 'number')
    )];

    const [allEntities, incidents, reports, newIncidentsSubs] = await Promise.all([
        entitiesCollection.find({}).toArray(),
        incidentIds.length > 0
            ? incidentsCollection.find({ incident_id: { $in: incidentIds } }).toArray()
            : Promise.resolve([] as DBIncident[]),
        reportNumbers.length > 0
            ? reportsCollection.find({ report_number: { $in: reportNumbers } }).toArray()
            : Promise.resolve([] as DBReport[]),
        subscriptionsCollection.find({ type: 'new-incidents' }).toArray(),
    ]);

    const incidentById = new Map<number, DBIncident>(incidents.map(i => [i.incident_id!, i]));
    const reportByNumber = new Map<number, DBReport>(reports.map(r => [r.report_number!, r]));
    const entityById = new Map<string, DBEntity>(allEntities.map(e => [e.entity_id!, e]));

    const entityIdsTouched = [...new Set(
        pendingNotifications
            .filter(n => n.type === 'entity' && n.entity_id)
            .map(n => n.entity_id as string)
    )];
    const incidentIdsTouchedForUpdates = [...new Set(
        pendingNotifications
            .filter(n => n.type === 'new-report-incident' || n.type === 'incident-updated')
            .map(n => n.incident_id)
            .filter((id): id is number => typeof id === 'number')
    )];

    const [entitySubs, incidentSubs] = await Promise.all([
        entityIdsTouched.length > 0
            ? subscriptionsCollection.find({ type: 'entity', entityId: { $in: entityIdsTouched } }).toArray()
            : Promise.resolve([] as DBSubscription[]),
        incidentIdsTouchedForUpdates.length > 0
            ? subscriptionsCollection.find({ type: 'incident', incident_id: { $in: incidentIdsTouchedForUpdates } }).toArray()
            : Promise.resolve([] as DBSubscription[]),
    ]);

    // Build the per-user digest by walking each pending notification.
    const digestByUser = new Map<string, UserDigest>();
    const includedNotifications: DBNotification[] = [];

    const ensureDigest = (userId: string): UserDigest => {
        let digest = digestByUser.get(userId);
        if (!digest) {
            digest = emptyDigest();
            digestByUser.set(userId, digest);
        }
        return digest;
    };

    // Track per-user dedupe so a single user doesn't see the same row twice when
    // multiple notifications fire for the same incident/entity event.
    const seenNewIncident = new Map<string, Set<number>>();
    const seenEntityEvent = new Map<string, Set<string>>();
    const seenIncidentUpdate = new Map<string, Set<string>>();
    const seenSubmission = new Map<string, Set<number>>();

    const dedupeAdd = <K>(map: Map<string, Set<K>>, userId: string, key: K): boolean => {
        let set = map.get(userId);
        if (!set) { set = new Set<K>(); map.set(userId, set); }
        if (set.has(key)) return false;
        set.add(key);
        return true;
    };

    for (const notification of pendingNotifications) {

        if (notification.type === 'new-incidents') {
            const incident = typeof notification.incident_id === 'number'
                ? incidentById.get(notification.incident_id)
                : undefined;
            if (!incident) continue;
            includedNotifications.push(notification);

            const entry = incidentToNewIncidentEntry(incident, allEntities);
            for (const sub of newIncidentsSubs) {
                if (dedupeAdd(seenNewIncident, sub.userId, incident.incident_id!)) {
                    ensureDigest(sub.userId).newIncidents.push(entry);
                }
            }

        } else if (notification.type === 'entity') {
            const incident = typeof notification.incident_id === 'number'
                ? incidentById.get(notification.incident_id)
                : undefined;
            const entity = notification.entity_id ? entityById.get(notification.entity_id) : undefined;
            if (!incident || !entity) continue;
            includedNotifications.push(notification);

            const subs = entitySubs.filter(s => s.entityId === entity.entity_id);
            const base = incidentToNewIncidentEntry(incident, allEntities);
            const entry: EntityEventEntry = {
                ...base,
                entityName: entity.name,
                entityUrl: `${config.SITE_URL}/entities/${entity.entity_id}`,
                isUpdate: !!notification.isUpdate,
            };
            const dedupeKey = `${entity.entity_id}:${incident.incident_id}:${entry.isUpdate ? 'u' : 'n'}`;
            for (const sub of subs) {
                if (dedupeAdd(seenEntityEvent, sub.userId, dedupeKey)) {
                    ensureDigest(sub.userId).entityEvents.push(entry);
                }
            }

        } else if (notification.type === 'new-report-incident' || notification.type === 'incident-updated') {
            const incident = typeof notification.incident_id === 'number'
                ? incidentById.get(notification.incident_id)
                : undefined;
            if (!incident) continue;
            includedNotifications.push(notification);

            const subs = incidentSubs.filter(s => s.incident_id === incident.incident_id);
            const newReport = typeof notification.report_number === 'number'
                ? reportByNumber.get(notification.report_number)
                : undefined;

            const entry: IncidentUpdateEntry = {
                incidentId: `${incident.incident_id}`,
                incidentTitle: incident.title,
                incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                reportUrl: newReport
                    ? `${config.SITE_URL}/cite/${incident.incident_id}#r${newReport.report_number}`
                    : undefined,
                reportTitle: newReport?.title,
                reportAuthor: newReport?.authors?.[0] ?? undefined,
            };
            const dedupeKey = `${incident.incident_id}:${notification.type}:${notification.report_number ?? ''}`;
            for (const sub of subs) {
                if (dedupeAdd(seenIncidentUpdate, sub.userId, dedupeKey)) {
                    ensureDigest(sub.userId).incidentUpdates.push(entry);
                }
            }

        } else if (notification.type === 'submission-promoted') {
            const incident = typeof notification.incident_id === 'number'
                ? incidentById.get(notification.incident_id)
                : undefined;
            const userId = notification.userId?.toString();
            if (!incident || !userId) continue;
            includedNotifications.push(notification);

            const entry: SubmissionPromotedEntry = {
                incidentId: `${incident.incident_id}`,
                incidentTitle: incident.title,
                incidentUrl: `${config.SITE_URL}/cite/${incident.incident_id}`,
                incidentDescription: incident.description ?? undefined,
                incidentDate: incident.date,
            };
            if (dedupeAdd(seenSubmission, userId, incident.incident_id!)) {
                ensureDigest(userId).submissionsPromoted.push(entry);
            }
        }
    }

    if (digestByUser.size === 0) {
        // Mark everything we picked up as processed (subscribers may have unsubscribed,
        // referenced incidents/entities may be missing, etc.) — there's nothing to send.
        await markNotificationsAsProcessed(notificationsCollection, includedNotifications);
        console.log('Process Pending Notifications: No recipients matched any pending notifications.');
        return includedNotifications.length;
    }

    const userIds = [...digestByUser.keys()];
    const resolvedRecipients = await userCacheManager.getAndCacheRecipients(userIds, context);
    const recipients = resolvedRecipients
        .filter(r => digestByUser.has(r.userId))
        .map(r => ({
            email: r.email,
            userId: r.userId,
            dynamicData: digestByUser.get(r.userId)!,
        }));

    if (recipients.length === 0) {
        await markNotificationsAsProcessed(notificationsCollection, includedNotifications);
        console.log('Process Pending Notifications: No deliverable recipients.');
        return includedNotifications.length;
    }

    // Mark first so concurrent runs don't double-send; revert on send failure.
    await markNotificationsAsProcessed(notificationsCollection, includedNotifications);

    try {
        const params: SendBulkEmailParams = {
            recipients,
            subject: 'AI Incident Database Notifications',
            templateId: 'Notifications',
        };
        await sendBulkEmails(params);
    } catch (error: any) {
        await markNotificationsAsNotProcessed(notificationsCollection, includedNotifications);
        error.message = `[Process Pending Notifications]: ${error.message}`;
        throw error;
    }

    console.log(`Process Pending Notifications: ${includedNotifications.length} notifications digested into ${recipients.length} email(s).`);

    return includedNotifications.length;
}

export const run = async () => {
    try {
        await processNotifications();
        console.log('Process Pending Notifications: Completed.');
        process.exit(0);
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
}

if (require.main === module) {

    run();
}
