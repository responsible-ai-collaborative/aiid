import * as notifications from '../../src/scripts/process-notifications';
import * as weeklyNotifications from '../../src/scripts/process-weekly-notifications';
import * as reporter from '../reporter';

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
        const mockReporterError = jest.spyOn(reporter, 'error').mockImplementation();
        const mockProcessNotifications = jest.spyOn(notifications, 'processNotifications')

        const testError = new Error('Test error');
        mockProcessNotifications.mockRejectedValueOnce(testError);

        await notifications.run();

        expect(mockConsoleError).toHaveBeenCalledWith(testError);
        expect(mockReporterError).toHaveBeenCalledWith(testError);
        expect(mockProcessExit).toHaveBeenCalledWith(1);

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockReporterError).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });

    it('should handle errors properly for weekly notifications, log them, and exit with code 1', async () => {

        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockReporterError = jest.spyOn(reporter, 'error').mockImplementation();
        const mockProcessWeeklyNotifications = jest.spyOn(weeklyNotifications, 'processWeeklyNotifications')

        const testError = new Error('Test error');
        mockProcessWeeklyNotifications.mockRejectedValueOnce(testError);

        await weeklyNotifications.run();

        expect(mockConsoleError).toHaveBeenCalledWith(testError);
        expect(mockReporterError).toHaveBeenCalledWith(testError);
        expect(mockProcessExit).toHaveBeenCalledWith(1);

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockReporterError).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });

    it('should log success and exit with code 0 when processing succeeds', async () => {

        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockReporterError = jest.spyOn(reporter, 'error').mockImplementation();
        const mockProcessNotifications = jest.spyOn(notifications, 'processNotifications')

        mockProcessNotifications.mockResolvedValueOnce(1);

        await notifications.run();

        expect(mockConsoleLog).toHaveBeenCalledWith('Process Pending Notifications: Completed.');
        expect(mockProcessExit).toHaveBeenCalledWith(0);

        expect(mockConsoleError).not.toHaveBeenCalled();
        expect(mockReporterError).not.toHaveBeenCalled();

        expect(mockConsoleLog).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });
});