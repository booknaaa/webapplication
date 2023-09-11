const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');
const {instruments} = require('../src/db/models')
const {value} = require('../src/db/models')
const db = require('../src/db/models')

exports.serialport = async (req, res) => {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId, {
    include: [{ model: db.instruments }]
      });
  let count = 1; 
    if (post) {
 
      const instrument = await instruments.findOne({
        where: {
          postId: postId
        },
        attributes: ['portId','baudrateId','func','id','count'], // เลือกเฉพาะคอลัมน์ port
      });
      // =  instrment.dataValues.func 
      const commands =  "SENSe:CHANnel 1" + '\r\n' + "SENSe:PROBe 1" + '\r\n' + "INIT" + '\r\n' + "FETCh?" + '\r\n';
      const port =(instrument.dataValues.portId);
      const baudRate = (instrument.dataValues.baudrateId);
      const funcid = (instrument.dataValues.id);
      let countins = (instrument.dataValues.count);

      const serialPort = new SerialPort({path: port,
      baudRate: baudRate, // อัตราเร็วของ Serial Port
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false,
    });
    
    serialPort.on('open', () => {
      console.log('Serial Port is open.');
      sendDataInterval = setInterval(() => {
        serialPort.write(commands, (err) => {
          if (err) {
            console.error('Error writing to serial port:', err);
          } else {
            console.log('Commands sent to serial port.',commands);
          }
        });
      }, 5000); // ส่งทุก 5 วินาที
      });
      let receivedData = Buffer.alloc(0);
let dataCount = 0;

serialPort.on('data', async (data) => {
  const newBuffer = Buffer.from(data);
  receivedData = Buffer.concat([receivedData, newBuffer]);
  dataCount++;

  if (dataCount === 2) {
    const receivedString = receivedData.toString(); // แปลงเป็น string
    const receivedNumber = parseFloat(receivedString);
    const formattedNumber = receivedNumber.toFixed(4); // จัดรูปแบบทศนิยม 4 หลัก
    console.log('Received data:', formattedNumber);
    dataCount = 0;
    receivedData = Buffer.alloc(0); // เคลียร์ Buffer สำหรับรับข้อมูลใหม่.

    const postId = req.params.id;
    await instruments.update(
      {
        value: formattedNumber,
      },
      {
        where: { id:funcid },
      }
    );
    if(count<=countins){
    value.create({
      datavalue: formattedNumber, 
      instrumentId: funcid,
      postId: postId,
      countId:count++
    })}
    /*else{
      count = 1;
      value.destroy(
      {
        where: { postId:postId },
      }
    )}*/
    else{
      count = 1;
      clearInterval(sendDataInterval);
    }
  }
});
serialPort.on('error', (err) => {
  console.error('Serial Port error:', err);
});

process.on('SIGINT', () => {
  clearInterval(sendDataInterval);
  serialPort.close(() => {
    console.log('ปิดการเชื่อมต่อ Serial Port');
    process.exit();
  });
});

const post = await db.Post.findByPk(postId, {
    include: [{ model: db.instruments,
         include: [{ model: db.value }]
     }]
  });


      res.render('dashboard', {post});
    } else {
      res.send('Post not found');
    }
  };

  exports.datadashboard = async (req, res) => {
    const insId = req.params.id;
    const ins = await db.instruments.findByPk(insId, {
      include: [{ model: db.value}]
});
    if(ins){
      const postid = (ins.postId)
      const post = await db.Post.findByPk(postid)
      const allid = await db.Post.findByPk(postid, {
        include: [{ model: db.instruments }]
          });
        console.log(allid)
        res.render('dashboarddata', {ins,post,allid});
      } else {
        res.send('Ins not found');
      }
    };



  exports.postvalue = async (req, res) => {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId, {
      include: [{ model: db.instruments }]
    });
      if (post) {
        const instruments = await instruments.findOne({
          where: {
            postId: postId
          },
          attributes: ['portId'], // เลือกเฉพาะคอลัมน์ port
        });
      }
        if (!instruments) {
          return res.status(404).send('instruments not found');
        }
        // เพิ่มข้อมูลลงในฐานข้อมูล
        const { value } = req.body;
        value.create({  value,functionId: instruments.id,postId: instruments.postId}) // สมมติว่าโมเดลที่เกี่ยวข้องชื่อ Data
          .then(() => {
            res.redirect(`/home/${postId}`);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('An error occurred');
          });
  };
