import * as common from '../fields/common';

describe('Atlas', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should cache the access token, and only request a new one after expiration', async () => {

        // token expiration: Monday, 18 November 2024 20:57:31 UTC

        const mockData1 = {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOnsiYXBwX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBT3luZXpWbXN2Ui92YXMrd3lHVzBjSE41d0xiSEM1R3hPSWpOUzZNQnByU2tLWXk3K0JIa2IyT0J4dHNFUFRWVUdDMWdFNXgxQ0Z2QnhEMDBTcnNYREVJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwiYXV0aC9zb3VyY2VkX2J5X3Byb3ZpZGVyX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBSVIvMEhSaHk5ZEtzaGJMekNwM1daenpwNGpjSHBjRGYrdWxxT2UvSmdYb21pbTJ4T0VSWXlGNmp3TTkzdjZRMXZENG9VY0cxcHlYdVFJM00yTjNoNTRJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwibW9uZ29kYi9jbG91ZC1hcGlLZXkiOiJjd0FBQUFWMllXeDFaUUJRQUFBQUFMNklNMCs3M0VkMUNOSnFGeEVxeUw5dTBLS0ZmbzdWaTlOSitoby9DNEtLcWtBcW04NmVaUlZyNW1LM0xLNElGTXo5a0Q0N0o3WktYYVUrSlV0Nkp6MFNWMTJ3cGtmd2dvVUs4ajNPMS94d0NHVnVZM0o1Y0hSbFpGOTJZV3gxWlFBQkFBPT0iLCJtb25nb2RiL2Nsb3VkLXVzZXJuYW1lIjoiVXdBQUFBVjJZV3gxWlFBd0FBQUFBSjZUZnlDVU1wT2VGMHg0aTJuV1NldjR1OUVrbGxrQjhWWVFwenFyaFhVdXRyYnN3N3hURTNxMkJkYU1CTnROekFobGJtTnllWEIwWldSZmRtRnNkV1VBQVFBPSJ9LCJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiZXhwIjoxNzMxOTYzNDUxLCJpYXQiOjE3MzE5NjE2NTEsImlzcyI6IjY3M2JhMzMzMDJhMzFkMjliZjY0Mzc3MiIsImp0aSI6IjY3M2JhMzMzMDJhMzFkMjliZjY0Mzc3ZCIsInN1YiI6IjY1ZThiYzc4ZjMzMjhhMGM4MjU5ZGIxYyIsInR5cCI6ImFjY2VzcyJ9.gNEFR8fkZt20Y_vq9t9XUSczV1iQV59bng0vw2oASJo",
            "user_id": "user1",
        }
        
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData1)
        });

        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.parse('2024-11-18T20:27:31.000Z'));
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.parse('2024-11-18T20:28:31.000Z'));

        // token has not been cached yet
        const result1 = await common.getAccessToken();;
        // token has been cached
        const result2 = await common.getAccessToken();;

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(result1).toBe(mockData1.access_token);
        expect(result2).toBe(mockData1.access_token);


        // token expiration: Monday, 18 November 2024 23:31:58 UTC

        const mockData2 = {
            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYWFzX2RhdGEiOnsiYXBwX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBRVROQ0R1QnRxWG1HNkp0Z09qVkl4UkdVRTc4aUZOZEtlZElLWUM1aHljVWVYTEQ1V0R6Q3V1clRHcEtVMWF2TTlZRnJHSEZtbytaY1l6Zm5nQkZ4REVJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwiYXV0aC9zb3VyY2VkX2J5X3Byb3ZpZGVyX2lkIjoiWXdBQUFBVjJZV3gxWlFCQUFBQUFBTjRlZVlyS2l6WURDdVFodmkrNVBUaXRYcGQ0UGJWc2VDelpIOTUwWFljVWExa045bmdjUDhHcGZQbDc1MysvcE1PNFFLbDR3aUhJYWdlMWIvaFJYcjhJWlc1amNubHdkR1ZrWDNaaGJIVmxBQUVBIiwibW9uZ29kYi9jbG91ZC1hcGlLZXkiOiJjd0FBQUFWMllXeDFaUUJRQUFBQUFPNnJtb0dtZUhtTkhscytLOHlTUVNWZ1N1Mm5BajBxTWJ2cGdzM2RzTEdHdjlVQ0s4N21tOUpjMWQrc3JKSWJVZmdsSWpNR3JKS0RZd3F6OVdQUjJkeVgra2JUSGNIMEdPQUxJb2FCVmtmV0NHVnVZM0o1Y0hSbFpGOTJZV3gxWlFBQkFBPT0iLCJtb25nb2RiL2Nsb3VkLXVzZXJuYW1lIjoiVXdBQUFBVjJZV3gxWlFBd0FBQUFBR3F4eWFWNUVuQUp3bC9RQVNkbTdBTno3VU9SZnBwcm45Z1dvcHMvbFFrY05tdVNzVDVSWFp6QTZOaENpWkJBUGdobGJtTnllWEIwWldSZmRtRnNkV1VBQVFBPSJ9LCJiYWFzX2RldmljZV9pZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsImJhYXNfZG9tYWluX2lkIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwiZXhwIjoxNzMxOTcyNzE4LCJpYXQiOjE3MzE5NzA5MTgsImlzcyI6IjY3M2JjNzY2MDJhMzFkMjliZjcwNWNkMiIsImp0aSI6IjY3M2JjNzY2MDJhMzFkMjliZjcwNWNkZCIsInN1YiI6IjY1ZThiYzc4ZjMzMjhhMGM4MjU5ZGIxYyIsInR5cCI6ImFjY2VzcyJ9.XJ0uU4ghOOF5RMIRhbQ8zjF7iJn4VxddhqatQW8gyVE",
            user_id: "user1",
        }

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData2)
        });

        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.parse('2024-11-18T20:56:31.000Z'));
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => Date.parse('2024-11-18T20:57:31.000Z'));


        // token has expired, so a new one should be requested
        const result3 = await common.getAccessToken();;
        // token has been cached
        const result4 = await common.getAccessToken();;

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(result3).toBe(mockData2.access_token);
        expect(result4).toBe(mockData2.access_token);
    });
});
