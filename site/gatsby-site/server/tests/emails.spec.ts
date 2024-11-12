import { EmailParams } from 'mailersend';
import * as emails from '../emails';

describe('Emails', () => {

    test('Should throw assertion error if any email has multiple recipients', async () => {

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

});