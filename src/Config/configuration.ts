export default () => ({
  host: process.env.HOST_MAIL,
  port: parseInt(process.env.PORT_MAIL),
  user: process.env.USER_MAIL,
  pass: process.env.PASS_MAIL,
  jwt: process.env.JWT_SECRET,
  mongodb: process.env.MONGO_URL,
});
