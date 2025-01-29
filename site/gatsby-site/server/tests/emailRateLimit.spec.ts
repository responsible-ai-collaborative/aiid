import { RateLimiter } from "limiter";
import * as emails from "../emails";
import { EmailParams } from "mailersend";

const sendBulkMock = jest.fn().mockResolvedValue(true);

jest.mock("mailersend", () => ({
    MailerSend: jest.fn().mockImplementation(() => ({
        email: {
            sendBulk: sendBulkMock,
        },
    })),
}));

describe("mailersendBulkSend with rate limiter", () => {

    it("Allows only 10 calls per minute", async () => {

        emails.setLimiter(new RateLimiter({
            tokensPerInterval: 10,
            interval: 2000,
        }));

        sendBulkMock.mockClear();

        // @ts-ignore
        const emailParams: EmailParams = {
            to: [{ email: "test@test.com", name: "test" }],
            subject: "test",
            html: "test",
        };

        for (let i = 0; i < 10; i++) {
            await emails.mailersendBulkSend([emailParams]);
        }

        const initial = Date.now();

        // this call should be delayed by 2 seconds

        await emails.mailersendBulkSend([emailParams]);

        const elapsed = Date.now() - initial;

        expect(elapsed).toBeCloseTo(2000, -2);
        
        expect(sendBulkMock).toHaveBeenCalledTimes(11);
    });
});