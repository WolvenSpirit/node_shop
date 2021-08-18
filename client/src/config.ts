/**
 * Configuration exports and constant utils
 */
export const baseURL = 'http://localhost:9003';
export const imagePlaceholderURL = "https://www.nicomatic.com/themes/custom/jango_sub/img/no-image.png";

export const constructURL = (s: string): string => {
    let isNotRelative: RegExp = /https\:\/\//g;
    return s.match(isNotRelative) !== null ? s : `${baseURL}${s}`;
};