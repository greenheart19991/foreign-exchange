const emptyStringToNullTransformer = (cur, orig) => (
    orig === '' ? null : cur
);

export {
    emptyStringToNullTransformer
};
