import { EmailParams } from 'mailersend';
import * as emails from '../emails';

describe('Emails', () => {

    describe('bulk', () => {

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

        test('Should call sendBulkEmail with appropriate params', async () => {

            jest.spyOn(emails, 'sendBulkEmails');
            jest.spyOn(emails, 'mailersendBulkSend').mockResolvedValue();

            const params: emails.SendBulkEmailParams =
            {
                recipients: [{ email: 'sender1@example.com' }, { email: 'sender2@example.com' }],
                subject: 'Test Email',
                templateId: 'Login',
                dynamicData: { magicLink: `<a href="http://example.com">example.com</a>` },
            }

            await emails.sendBulkEmails(params);

            expect(emails.mailersendBulkSend).toHaveBeenCalledWith([
                expect.objectContaining({
                    bcc: undefined,
                    cc: undefined,
                    to: [{ email: "sender1@example.com", },],
                    personalization: [
                        expect.objectContaining({
                            data: expect.objectContaining({
                                magicLink: '<a href="http://example.com">example.com</a>'
                            })
                        })
                    ]
                }),
                expect.objectContaining({
                    bcc: undefined,
                    cc: undefined,
                    to: [{ email: "sender2@example.com", },],
                    personalization: [
                        expect.objectContaining({
                            data: expect.objectContaining({
                                magicLink: '<a href="http://example.com">example.com</a>'
                            })
                        })
                    ]
                })
            ]);
        })
    });

    describe('single', () => {

        test('Should throw an assertion error if the email "to" field contains multiple recipients', async () => {

            jest.spyOn(emails, 'mailersendSingleSend');

            const single = new EmailParams()
                .setFrom({ email: 'sender@example.com', name: 'Sender' })
                .setTo([
                    { email: 'recipient1@example.com', name: 'Recipient 1' },
                    { email: 'recipient2@example.com', name: 'Recipient 2' }
                ])
                .setSubject('Test Email')
                .setText('Test content')
                .setHtml('<p>Test content</p>')
                .setSendAt(Date.now())

            await expect(emails.mailersendSingleSend(single))
                .rejects
                .toThrow('Email must have exactly one recipient');
        });

        test('Should throw an assertion error if the email "cc" field is used', async () => {

            jest.spyOn(emails, 'mailersendBulkSend');

            const multiRecipientEmail = new EmailParams()
                .setFrom({ email: 'sender@example.com', name: 'Sender' })
                .setTo([{ email: 'recipient1@examplee.com`', name: 'Recipient 1' }])
                .setCc([
                    { email: 'recipient1@example.com', name: 'Recipient 1' },
                    { email: 'recipient2@example.com', name: 'Recipient 2' }
                ])
                .setSubject('Test Email')
                .setText('Test content')
                .setHtml('<p>Test content</p>')
                .setSendAt(Date.now())

            await expect(emails.mailersendSingleSend(multiRecipientEmail))
                .rejects
                .toThrow('Should not use the \"cc\" field');
        });

        test('Should call sendEmail with appropriate params', async () => {

            jest.spyOn(emails, 'sendEmail');
            jest.spyOn(emails, 'mailersendSingleSend').mockResolvedValue();

            const params: emails.SendEmailParams =
            {
                recipient: { email: 'sender1@example.com' },
                subject: 'Test Email',
                templateId: 'Login',
                dynamicData: { magicLink: `<a href="http://example.com">example.com</a>` },
            }

            await emails.sendEmail(params);

            expect(emails.mailersendSingleSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    bcc: undefined,
                    cc: undefined,
                    to: [{ email: "sender1@example.com" },],
                    personalization: [
                        expect.objectContaining({
                            data: expect.objectContaining({
                                magicLink: '<a href="http://example.com">example.com</a>'
                            })
                        })
                    ]
                }),
            );
        })
    });
});