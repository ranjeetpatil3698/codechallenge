const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const xss=require('xss-clean');
const hpp=require('hpp');
const compression = require('compression');
const PlanController = require('./controller/PlanController');
const PromotionController = require('./controller/PromotionController');
const SubscriptionController = require('./controller/SubscriptionController');
const InputController = require('./controller/InputController');

const app = express();


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());


const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'too many requests from this ip,please try again in an hour'
})

app.use('/api',limiter)
app.use(express.json({limit:'10kb'})); 

app.use(xss());

app.use(hpp({whitelist:[
  'plan',
  'promotion',
  'subscribe',
  'sort',
  'user',
  'timeperiod'
]}));

app.use(compression());


app.route("/plan")
  .get(PlanController.getAllPlans)
  .post(InputController.validatePlanData,PlanController.createPlan);

app.route("/promotion")
  .get(PromotionController.SortByUser,
       PromotionController.SortByTimePeriod,
       PromotionController.getAllPromotions)
  .post(InputController.validatePromotionData,PromotionController.createPromotion);

app.route("/subscribe")
  .post(InputController.validateSubscritionData,SubscriptionController.subscribeToPromotion);

app.all('*',(req,res,next)=>{
    res.status(400).json({message:"THIS PATH DOES NOT EXIST"})
});


module.exports = app;


