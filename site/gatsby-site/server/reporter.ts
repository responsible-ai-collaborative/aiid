import Rollbar from 'rollbar';
import config from '../server/config';

const rollbar = new Rollbar({
    accessToken: config.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        code_version: '1.0.0',
    }
});

export const error = (error: Error) => {
    rollbar.error(error);
}