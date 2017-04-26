import Express from 'express';
import GraphqlServer from 'express-graphql';
import Schema from './schema';

const PORT = 4000;
const app = Express();

app.use('/api', GraphqlServer({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(PORT, ()=> {
  console.log(`App is running on port ${PORT}`);
});
