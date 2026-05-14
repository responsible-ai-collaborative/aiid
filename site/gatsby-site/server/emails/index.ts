import { EmailParams, MailerSend, Recipient } from "mailersend";
import config from "../config";
import templates from "./templates";
import assert from "assert";
import { RateLimiter } from "limiter";

export interface SendBulkEmailParams {
    recipients: {
        email: string;
        userId?: string;
        // Per-recipient overrides; merged on top of the shared dynamicData below.
        dynamicData?: Record<string, any>;
    }[];
    subject: string;
    dynamicData?: Record<string, any>;
    templateId: string; // Email template ID
}

export const replacePlaceholdersWithAllowedKeys = (template: string, data: any = {}, allowedKeys: string[]): string => {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return allowedKeys.includes(key) && key in data ? data[key] : match;
    });
}

let bulkLimiter = new RateLimiter({
    tokensPerInterval: 10,
    interval: "minute",
});

/**
 * Sets a custom rate limiter, primarily used in tests to override the default 
 * rate limiting behavior and avoid waiting for the standard 1-minute delay.
 * 
 * @param limiter - The custom rate limiter instance to use
 * @example
 * // In tests, you can set a mock limiter with no delay
 * setLimiter(new MockRateLimiter({ delay: 0 }));
 */
export const setLimiter = (limiter: RateLimiter) => {
    bulkLimiter = limiter;
}

/**
 * Sends multiple emails using MailerSend's bulk email API.
 * 
 * Note: While MailerSend's bulk API allows up to 15 calls per minute,
 * we implement a more conservative rate limit for stability.
 * 
 * @param emails - Array of email parameters. Each email must have exactly one recipient
 * and should not use the CC field.
 * @throws {AssertionError} If any email has multiple recipients or uses CC field
 * @example
 * await mailersendBulkSend([
 *   {
 *     to: ['user@example.com'],
 *     subject: 'Hello',
 *     text: 'Message content'
 *   }
 * ]);
 */
// MailerSend's bulk endpoint rejects requests with more than 500 email objects (#MS42229).
export const MAILERSEND_BULK_CHUNK_SIZE = 500;

// MailerSend's per-account quota is a 60s sliding window, so a one-minute wait
// is the minimum that reliably clears it.
const RATE_LIMIT_RETRY_DELAY_MS = 60_000;

const sendWithRateLimitRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (error?.statusCode !== 429) throw error;
        console.warn(`MailerSend 429; retrying after ${RATE_LIMIT_RETRY_DELAY_MS}ms`);
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS));
        return await fn();
    }
};

export const mailersendBulkSend = async (emails: EmailParams[]) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    assert(emails.every(email => email.to.length == 1), 'Emails must have exactly one recipient');
    assert(emails.every(email => !email.cc), 'Should not use the "cc" field');

    for (let i = 0; i < emails.length; i += MAILERSEND_BULK_CHUNK_SIZE) {
        const chunk = emails.slice(i, i + MAILERSEND_BULK_CHUNK_SIZE);

        await bulkLimiter.removeTokens(1);

        await sendWithRateLimitRetry(() => mailersend.email.sendBulk(chunk));
    }
}

export const sendBulkEmails = async ({ recipients, subject, dynamicData, templateId }: SendBulkEmailParams) => {

    const emailTemplateBody = templates[templateId];

    if (!emailTemplateBody) {
        throw new Error(`Template not found: ${templateId}`);
    }

    const bulk: EmailParams[] = [];

    for (const recipient of recipients) {

        const mergedData = {
            ...dynamicData,
            ...recipient.dynamicData,
            email: recipient.email,
            userId: recipient.userId,
            siteUrl: config.SITE_URL,
        };

        const personalizations = [{
            email: recipient.email,
            data: mergedData,
        }]

        // We have to do this because MailerSend is escaping the placeholders containing html tags
        const html = replacePlaceholdersWithAllowedKeys(emailTemplateBody, mergedData, ['developers', 'deployers', 'entitiesHarmed', 'implicatedSystems'])

        const emailParams = new EmailParams()
            .setFrom({ email: config.NOTIFICATIONS_SENDER, name: config.NOTIFICATIONS_SENDER_NAME })
            .setTo([new Recipient(recipient.email)])
            .setPersonalization(personalizations)
            .setSubject(subject)
            .setHtml(html);
        //TODO: add a text version of the email
        // .setText("Greetings from the team, you got this message through MailerSend.");

        bulk.push(emailParams);
    }

    try {

        await mailersendBulkSend(bulk);

    } catch (error: any) {
        error.message = `[Send Email]: ${error.message}`;
        console.error(error);

        throw error;
    }
}

export const mailersendSingleSend = async (email: EmailParams) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    assert(email.to.length == 1, 'Email must have exactly one recipient');
    assert(!email.cc, 'Should not use the "cc" field');

    await bulkLimiter.removeTokens(1);

    await sendWithRateLimitRetry(() => mailersend.email.send(email));
}

export interface SendEmailParams {
    recipient: {
        email: string;
        userId?: string;
    };
    subject: string;
    dynamicData?: {
        magicLink?: string;
    };
    templateId: string;
}

export const sendEmail = async ({ recipient, subject, dynamicData, templateId }: SendEmailParams) => {

    const emailTemplateBody = templates[templateId];

    if (!emailTemplateBody) {
        throw new Error(`Template not found: ${templateId}`);
    }

    const personalization = {
        email: recipient.email,
        data: {
            ...dynamicData,
            email: recipient.email,
            userId: recipient.userId,
            siteUrl: config.SITE_URL,
        }
    }

    const emailParams = new EmailParams()
        .setFrom({ email: config.NOTIFICATIONS_SENDER, name: config.NOTIFICATIONS_SENDER_NAME })
        .setTo([new Recipient(recipient.email)])
        .setPersonalization([personalization])
        .setSubject(subject)
        .setHtml(emailTemplateBody);
    //TODO: add a text version of the email
    // .setText("Greetings from the team, you got this message through MailerSend.");

    try {

        await mailersendSingleSend(emailParams);

    } catch (error: any) {
        error.message = `[Send Email]: ${error.message}`;
        console.error(error);

        throw error;
    }
}
