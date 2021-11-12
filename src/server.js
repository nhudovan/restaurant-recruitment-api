import  express         from 'express';
import  validator       from 'express-validator'; 
import  createError     from 'http-errors';
import  morgan          from 'morgan';
import  initWebRoutes   from './routes/web';
import  errorHandler    from './middleware/error';
import  mongoose        from 'mongoose';
import  databaseConfig  from './configs/database';
import  bodyParser      from 'body-parser';
import  xss             from 'xss-clean';
import  cookieParser    from 'cookie-parser';
import  helmet          from 'helmet';
import  rateLimit       from 'express-rate-limit';
import  cors            from 'cors';

const app = express();

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'))
app.use(validator());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(cors())

//
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);


//
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@star.4tcrt.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`)
  .then(()=> {
    console.log('Database connected');
})
  .catch((error)=> {
    console.log('Error connecting to database');
});


// Setup router
initWebRoutes(app);
app.use(errorHandler);




let port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log('Backend NodeJS is running on the port : ' + port);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

module.exports = app;