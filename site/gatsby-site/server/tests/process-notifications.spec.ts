import * as notifications from '../../src/scripts/process-notifications';
import * as briefingNotifications from '../../src/scripts/process-briefing-notifications';

describe('Process Notifications script', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle errors properly, log them, and exit with code 1', async () => {

        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockProcessNotifications = jest.spyOn(notifications, 'processNotifications')

        const testError = new Error('Test error');
        mockProcessNotifications.mockRejectedValueOnce(testError);

        await notifications.run();

        expect(mockConsoleError).toHaveBeenCalledWith(testError);
        expect(mockProcessExit).toHaveBeenCalledWith(1);

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly for briefing notifications, log them, and exit with code 1', async () => {

        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockProcessBriefingNotifications = jest.spyOn(briefingNotifications, 'processBriefingNotifications')

        const testError = new Error('Test error');
        mockProcessBriefingNotifications.mockRejectedValueOnce(testError);

        await briefingNotifications.run();

        expect(mockConsoleError).toHaveBeenCalledWith(testError);
        expect(mockProcessExit).toHaveBeenCalledWith(1);

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });

    it('should log success and exit with code 0 when processing succeeds', async () => {

        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockProcessNotifications = jest.spyOn(notifications, 'processNotifications')

        mockProcessNotifications.mockResolvedValueOnce(1);

        await notifications.run();

        expect(mockConsoleLog).toHaveBeenCalledWith('Process Pending Notifications: Completed.');
        expect(mockProcessExit).toHaveBeenCalledWith(0);

        expect(mockConsoleError).not.toHaveBeenCalled();

        expect(mockConsoleLog).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });
});