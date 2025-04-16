export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  dbUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  port: process.env.PORT
});