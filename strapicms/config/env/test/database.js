module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
  },
});