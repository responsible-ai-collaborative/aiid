import * as translateIncidents from '../../src/scripts/translateIncidents';

describe('Translate incidents script', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle errors properly, log them, and exit with code 1', async () => {

        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

        const mockRun = jest.spyOn(translateIncidents, 'translateIncidents')
        
        const testError = new Error('Test error');
        mockRun.mockRejectedValueOnce(testError);

        await translateIncidents.run();

        expect(mockConsoleError).toHaveBeenCalledWith(testError);
        expect(mockProcessExit).toHaveBeenCalledWith(1);

        expect(mockConsoleError).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });

    it('should log success and exit with code 0 when processing succeeds', async () => {

        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
        const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockRun = jest.spyOn(translateIncidents, 'translateIncidents');

        mockRun.mockResolvedValueOnce();

        await translateIncidents.run();

        expect(mockConsoleLog).toHaveBeenCalledWith('Translation completed successfully.');
        expect(mockProcessExit).toHaveBeenCalledWith(0);

        expect(mockConsoleError).not.toHaveBeenCalled();

        expect(mockConsoleLog).toHaveBeenCalledTimes(1);
        expect(mockProcessExit).toHaveBeenCalledTimes(1);
    });
});