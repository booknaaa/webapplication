import express from 'express';
import routes from './routes';
import config from './config/constants';
import bodyParser from 'body-parser';

// สร้าง instance express ไว้ในตัวแปร app
const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // หรือใช้ไลบรารี JSON หากไฟล์ Swagger Specification เป็น JSON

const swaggerDocument = YAML.load('app/swagger.yaml'); // ระบุพาธไปยังไฟล์ Swagger Specification ของคุณ

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// กำหนด middleware โดยใช้ Path Pattern
// ทุก request จะต้องมี path ที่ขึ้นต้นด้วย ค่าที่เรา config ไว้ในไฟล์ constants
app.use(bodyParser.json());
app.use('/api', routes);

// run instance web server โดยใช้ port ที่อยู่ในไฟล์ constants ของเรา
app.listen(config.port, () => {
    console.log(`
    Title : testsequelize
    Port: ${config.port}
    Env: ${app.get('env')}
  `);
});
