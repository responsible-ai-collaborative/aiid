import { EmailParams, MailerSend, Recipient } from "mailersend";
import config from "../config";
import templates from "./templates";
import * as reporter from '../reporter';
import assert from "assert";

export interface SendBulkEmailParams {
    recipients: {
        email: string;
        userId?: string;
    }[];
    subject: string;
    dynamicData?: {
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
        magicLink?: string;    // URL for magic link (optional)
    };
    templateId: string; // Email template ID
}

export const replacePlaceholdersWithAllowedKeys = (template: string, data: { [key: string]: string } = {}, allowedKeys: string[]): string => {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return allowedKeys.includes(key) && key in data ? data[key] : match;
    });
}

export const mailersendBulkSend = async (emails: EmailParams[]) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    assert(emails.every(email => email.to.length == 1), 'Emails must have exactly one recipient');
    assert(emails.every(email => !email.cc), 'Should not use the "cc" field');

    await mailersend.email.sendBulk(emails);
}

export const sendBulkEmails = async ({ recipients, subject, dynamicData, templateId }: SendBulkEmailParams) => {

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
        reporter.error(error);

        throw error;
    }
}

export const mailersendSingleSend = async (email: EmailParams) => {

    const mailersend = new MailerSend({
        apiKey: config.MAILERSEND_API_KEY,
    });

    assert(email.to.length == 1, 'Email must have exactly one recipient');
    assert(!email.cc, 'Should not use the "cc" field');

    await mailersend.email.send(email);
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
        reporter.error(error);

        throw error;
    }
}
