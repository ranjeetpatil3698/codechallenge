const dotenv = require('dotenv');


process.on('uncaughtException',err=>{
  console.log(err.name,err.message);
  console.log('Unhandled Exception ');
    process.exit(1);
  
});

dotenv.config({ path: './config.env' });

const app = require('./app');


const port = process.env.PORT;
const server= app.listen(port, () => {
  console.log(`listening to port ${port}`);
});


process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log('Unhandled Rejection ');
  server.close(()=>{
    process.exit(1);
  })
});
