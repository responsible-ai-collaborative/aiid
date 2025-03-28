export async function handleNotificationError(
  error: any,
  notificationsCollection: any,
  pendingNotifications: any,
  errorMessage: string
) {
  await markNotificationsAsNotProcessed(notificationsCollection, pendingNotifications);
  error.message = `${errorMessage}: ${error.message}`;
  throw error;
}

async function markNotifications(
  notificationsCollection: any,
  notifications: any,
  isProcessed: boolean
) {
  for (const pendingNotification of notifications) {
    await notificationsCollection.updateOne(
      { _id: pendingNotification._id },
      { $set: { processed: isProcessed, sentDate: new Date() } }
    );
  }
}

export async function markNotificationsAsNotProcessed(
  notificationsCollection: any,
  notifications: any
) {
  await markNotifications(notificationsCollection, notifications, false);
} 

export const markNotificationsAsProcessed = async (notificationsCollection: any, notifications: any) => {
  await markNotifications(notificationsCollection, notifications, true);
}