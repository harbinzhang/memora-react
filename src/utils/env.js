export const isLocal = () => {
    return location.hostname === "localhost";
};

export const getEnv = () => {
    return isLocal() ? "local" : "production";
};
