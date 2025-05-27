import { ObjectId } from "mongodb";
import { Context } from "../interfaces";

export interface UserAdminData {
    email?: string;
    creationDate?: Date;
    lastAuthenticationDate?: Date;
    disabled?: boolean;
    userId?: string;
}

export class UserCacheManager {
  private usersCache: UserAdminData[] = [];

  clearUsersCache() {
    this.usersCache.length = 0;
  }

  async getAndCacheRecipients(userIds: string[], context: Context) {
    const recipients = [];

    for (const userId of userIds) {
      let user = this.usersCache.find((user) => user.userId === userId) ?? null;

      if (!user) {
        user = await this.getUserAdminData(userId, context) ?? null;

        if (user) {
          this.usersCache.push(user);
        }
      }

      if (user?.email && user?.userId) {
        recipients.push({ email: user.email, userId: user.userId });
      }
    }

    return recipients;
  }

  async getUserAdminData(userId: string, context: Context): Promise<UserAdminData | null> {
    const authUsersCollection = context.client.db('auth').collection("users");
    const authUser = await authUsersCollection.findOne({ _id: new ObjectId(userId) });

    if (authUser) {
      return {
        email: authUser.email,
        creationDate: new Date(), //TODO: find a way to get this data
        lastAuthenticationDate: new Date(), //TODO: find a way to get this data
        disabled: false,
        userId,
      };
    }

    return null;
  }
} 