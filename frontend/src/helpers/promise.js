const addId = (promise, id) => promise
    .catch((e) => {
        // eslint-disable-next-line no-throw-literal
        throw { error: e, id };
    });

export {
    addId
};
