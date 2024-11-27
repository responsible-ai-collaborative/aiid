import { EmailParams } from 'mailersend';
import * as emails from '../emails';

describe('Emails', () => {

    test('Should throw an assertion error if the email "to" field contains multiple recipients', async () => {

        jest.spyOn(emails, 'mailersendBulkSend');

        const multiRecipientEmail = [new EmailParams()
            .setFrom({ email: 'sender@example.com', name: 'Sender' })
            .setTo([
                { email: 'recipient1@example.com', name: 'Recipient 1' },
                { email: 'recipient2@example.com', name: 'Recipient 2' }
            ])
            .setSubject('Test Email')
            .setText('Test content')
            .setHtml('<p>Test content</p>')
            .setSendAt(Date.now())]

        await expect(emails.mailersendBulkSend(multiRecipientEmail))
            .rejects
            .toThrow('Emails must have exactly one recipient');
    });

    test('Should throw an assertion error if the email "cc" field is used', async () => {

        jest.spyOn(emails, 'mailersendBulkSend');

        const multiRecipientEmail = [new EmailParams()
            .setFrom({ email: 'sender@example.com', name: 'Sender' })
            .setTo([{ email: 'recipient1@examplee.com`', name: 'Recipient 1' }])
            .setCc([
                { email: 'recipient1@example.com', name: 'Recipient 1' },
                { email: 'recipient2@example.com', name: 'Recipient 2' }
            ])
            .setSubject('Test Email')
            .setText('Test content')
            .setHtml('<p>Test content</p>')
            .setSendAt(Date.now())]

        await expect(emails.mailersendBulkSend(multiRecipientEmail))
            .rejects
            .toThrow('Should not use the \"cc\" field');
    });



});