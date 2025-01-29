import { EmailParams, MailerSend, Recipient } from "mailersend";
import config from "../config";
import templates from "./templates";
import * as reporter from '../reporter';
import assert from "assert";
import { RateLimiter } from "limiter";

interface SendEmailParams {
    recipients: {
        email: string;
        userId: string;
    }[];
    subject: string;
    dynamicData: {
        incidentId?: string;
        incidentTitle?: string;
        incidentUrl?: string;
        incidentDescription?: string;
        incidentDate?: string;
        developers?: string;
        deployers?: string;
        entitiesHarmed?: string;
        implicatedSystems?: string;
        reportUrl?: string;
        reportTitle?: string;
        reportAuthor?: string;
        entityName?: string;
        entityUrl?: string;
    };
    templateId: string;
}

export const replacePlaceholdersWithAllowedKeys = (template: string, data: { [key: string]: string }, allowedKeys: string[]): string => {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return allowedKeys.includes(key) && key in data ? data[key] : match;
    });
}

let bulkLimiter = new RateLimiter({
    tokensPerInterval: 10,
    interval: "second",
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
export const mailersendBulkSend = async (emails: EmailParams[]) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    assert(emails.every(email => email.to.length == 1), 'Emails must have exactly one recipient');
    assert(emails.every(email => !email.cc), 'Should not use the "cc" field');

    await bulkLimiter.removeTokens(1);

    await mailersend.email.sendBulk(emails);
}

export const sendEmail = async ({ recipients, subject, dynamicData, templateId }: SendEmailParams) => {

    const emailTemplateBody = templates[templateId];

    if (!emailTemplateBody) {
        throw new Error(`Template not found: ${templateId}`);
    }

    const bulk: EmailParams[] = [];

    for (const recipient of recipients) {

        const personalizations = [{
            email: recipient.email,
            data: {
                ...dynamicData,
                email: recipient.email,
                userId: recipient.userId,
                siteUrl: config.SITE_URL,
            }
        }]

        // We have to do this because MailerSend is escaping the placeholders containing html tags
        const html = replacePlaceholdersWithAllowedKeys(emailTemplateBody, dynamicData, ['developers', 'deployers', 'entitiesHarmed', 'implicatedSystems'])

        const emailParams = new EmailParams()
            .setFrom({ email: config.NOTIFICATIONS_SENDER, name: config.NOTIFICATIONS_SENDER_NAME })
            .setTo([new Recipient(recipient.email, '')])
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
        reporter.error(error);

        throw error;
    }
}
