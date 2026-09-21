import { jwtDecode } from 'jwt-decode';

export const isEmpty = (value) => (
    value === undefined
    || value === null
    || (typeof value === 'object' && Object.keys(value).length === 0)
    || (typeof value === 'string' && value.trim().length === 0)
);


const logoutOnUnauthorized = (error) => {
    const errorData = error?.response;
    if (
        !isEmpty(errorData)
        && errorData?.status === 401
        && ((errorData?.statusText === 'Unauthorized')
            || (errorData?.error === 'Unauthorized' && errorData?.message === 'Unauthorized')
            || (isEmpty(errorData?.data) && isEmpty(errorData?.statusText)))
    ) {
        window.localStorage.removeItem('loggedWyreUser');
        window.location.href = '/';
    }
};

/**
 * @description method to check if token will soon expire
 * @param time - the time remaining before token expires
 */
 const tokenIsExpired = (time = 30000) => {
    const data = localStorage.loggedWyreUser;
    const user = JSON.parse(data);
    if (user  && user.access) {
        const userDetails = jwtDecode(user.access);
        const currentTime = (Date.now() - time) / 1000;
        // check if token is expired
        if (userDetails?.exp < currentTime) {
            return true;
        }
    }
    return false;
};


/**
 * Product access from JWT. Uses has_ems / has_solar when present;
 * falls back to legacy is_solar_customer.
 */
export const getUserProductAccess = (userData) => {
    if (!userData) {
        return { hasEms: false, hasSolar: false, isSolarOnly: false };
    }

    const hasExplicitProductFlags =
        typeof userData.has_ems === 'boolean'
        || typeof userData.has_solar === 'boolean';

    if (hasExplicitProductFlags) {
        const hasEms = Boolean(userData.has_ems);
        const hasSolar = Boolean(userData.has_solar);
        return {
            hasEms,
            hasSolar,
            isSolarOnly: hasSolar && !hasEms,
        };
    }

    const legacySolarOnly = userData.is_solar_customer === true;
    return {
        hasEms: !legacySolarOnly,
        hasSolar: true,
        isSolarOnly: legacySolarOnly,
    };
};

export { logoutOnUnauthorized, tokenIsExpired };


