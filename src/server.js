import express from 'express';
import cors from 'cors';
import routes from 'routes';
import errorConverter from 'utils/rest-error';
import handleError from 'utils/handle-error';
import path from 'path';

/**
 * Express instance
 * @public
 */
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', routes);
app.use((req, res, next) => {
  return next(errorConverter(404, 'Not found'));
});

app.use(handleError);

export default app;
