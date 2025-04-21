import { Collection } from 'mongodb';
import { DBNotification } from '../../server/interfaces';

/**
 * Handles notification errors by marking notifications as not processed
 * and appending an error message before throwing the error.
 * 
 * @param error - The error object to be handled.
 * @param notificationsCollection - The collection of notifications.
 * @param pendingNotifications - The notifications that are pending.
 * @param errorMessage - The error message to append.
 */
export async function handleNotificationError(
  error: Error,
  notificationsCollection: Collection<DBNotification>,
  pendingNotifications: DBNotification[],
  errorMessage: string
) {
  await markNotificationsAsNotProcessed(notificationsCollection, pendingNotifications);
  error.message = `${errorMessage}: ${error.message}`;
  throw error;
}

/**
 * Marks notifications as processed or not processed in the collection.
 * 
 * @param notificationsCollection - The collection of notifications.
 * @param notifications - The notifications to be updated.
 * @param isProcessed - Boolean indicating if notifications are processed.
 */
async function markNotifications(
  notificationsCollection: Collection<DBNotification>,
  notifications: DBNotification[],
  isProcessed: boolean
) {
  for (const pendingNotification of notifications) {
    await notificationsCollection.updateOne(
      { _id: pendingNotification._id },
      { $set: { processed: isProcessed, sentDate: new Date() } }
    );
  }
}

/**
 * Marks notifications as not processed in the collection.
 * 
 * @param notificationsCollection - The collection of notifications.
 * @param notifications - The notifications to be marked as not processed.
 */
export async function markNotificationsAsNotProcessed(
  notificationsCollection: Collection<DBNotification>,
  notifications: DBNotification[]
) {
  await markNotifications(notificationsCollection, notifications, false);
} 

/**
 * Marks notifications as processed in the collection.
 * 
 * @param notificationsCollection - The collection of notifications.
 * @param notifications - The notifications to be marked as processed.
 */
export const markNotificationsAsProcessed = async (
  notificationsCollection: Collection<DBNotification>,
  notifications: DBNotification[]
) => {
  await markNotifications(notificationsCollection, notifications, true);
}