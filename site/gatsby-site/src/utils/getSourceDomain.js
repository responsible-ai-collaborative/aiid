/*
 * @param {URL} url
 *
 * @returns {string} A string for use the source_domain database field.
 */
export default (url) => url.hostname.replace(/^(www|m)\./, '');
