const up = (qi, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return qi.createTable('users', { id: Sequelize.INTEGER });
    */
};

const down = (qi, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return qi.dropTable('users');
    */
};

module.exports = {
    up,
    down
};
