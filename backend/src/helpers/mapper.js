const Sequelize = require('sequelize');

const getPlainData = (modelInstance) => {
    if (modelInstance instanceof Sequelize.Model) {
        return modelInstance.get({ plain: true });
    }

    let type;
    if (modelInstance === undefined) {
        type = 'undefined';
    } else if (modelInstance === null) {
        type = 'null';
    } else {
        type = modelInstance.constructor.name;
    }

    throw new TypeError(
        `Invalid instance provided. Expected to be one of Sequelize.Model type but got '${type}'`
    );
};

module.exports = {
    getPlainData
};
