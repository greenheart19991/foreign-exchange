import React from 'react';

const createOrController = (
    NextComponent,
    RootComponent,
    accKey,
    vKey
) => ({
    [accKey]: acc,
    [vKey]: v,
    ...rest
}) => {
    const res = acc || v;

    if (res) {
        const rootProps = {
            [vKey]: true,
            ...rest
        };

        return (
            <RootComponent {...rootProps} />
        );
    }

    const nextProps = {
        [accKey]: res,
        ...rest
    };

    return (
        <NextComponent {...nextProps} />
    );
};

const createOrComposer = (accKey, vKey) => (...enhancers) => (Component) => (
    [...enhancers]
        .reverse()
        .reduce((Acc, enhancer, i) => {
            const Enhanced = enhancer(Acc);

            if (i === enhancers.length - 1) {
                return Enhanced;
            }

            return createOrController(
                Enhanced,
                Component,
                accKey,
                vKey
            );
        }, Component)
);

export default createOrComposer;
