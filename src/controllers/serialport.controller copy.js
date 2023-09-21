const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline');
const {instruments} = require('../db/models')
const {value} = require('../db/models')
const {Post} = require('../db/models')
const db = require('../db/models')
const ExcelJS = require('exceljs');
const express = require ( 'express');
const app = express();

let purevalue = "";
let isSerialPortConnected = "";
let status123 = "";

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
      serialPort.close(() => {
        console.log('ปิดการเชื่อมต่อ Serial Port');
      });
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

  
  exports.pagedashboard = async (req, res) => {
    const postId = req.params.id;
    const post = await db.Post.findByPk(postId, {
      include: [{ model: db.instruments }]
        });
      if (post) {
const postId = req.params.id;
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

    exports.chartdashboard = async (req, res) => {
      const postId = req.params.id;
      const post = await db.Post.findByPk(postId, {
        include: [{ model: db.instruments }]
          });
        if (post) {
  const postId = req.params.id;
  const post = await db.Post.findByPk(postId, {
        include: [{ model: db.instruments,
             include: [{ model: db.value }]
         }]
      });
          res.render('charts', {post});
        } else {
          res.send('Post not found');
        }
      };
  
      exports.deletevalue = async (req, res) => {
        const valueId = req.params.id;
        if (valueId) {
          const func = await db.instruments.findByPk(valueId);
          const postId = func.postId;
          value.destroy({
            where: { instrumentId: valueId },
          });
          
          res.redirect(`/home/dashboard/${postId}`);
        } else {
          res.send("Ins not found");
        }
      };

      exports.datadashboard = async (req, res) => {
        const insId = req.params.id;
        const ins = await db.instruments.findByPk(insId, {
          include: [{ model: db.value}]
    });
    if(ins){
              const data = await db.value.findAll({
          where: { instrumentId: insId  },
         });
    
        // สร้างข้อมูลที่เหมาะสมสำหรับแผนภูมิ
        const labels = data.map(item => item.countId); // รายการของค่า xvalue
        const values = data.map(item => item.datavalue); // รายการของค่า yvalue
          const postid = (ins.postId)
          const countid = (ins.count)
          const post = await db.Post.findByPk(postid)
          const allid = await db.Post.findByPk(postid, {
            include: [{ model: db.instruments }]
              });

            res.render('dashboarddata', {countid,ins,post,allid,labels,values,data: global.myValue,isSerialPortConnected } );
                
          } else {
            res.send('Ins not found');
          }
        };
    
        exports.serialportpost = async (req, res) => {
          const funcId = req.params.id;
          const func = await db.instruments.findByPk(funcId);
          let count = 1; 
          if (func) {
              const c2o2mmands =  ["SENSe:CHANnel 1","SENSe:PROBe 1","INIT","FETCh?"];
              const input = func.func
              const output = input.split(',').map(item => item.trim());
              const Commands = output.join('\r\n');

      
              const port =(func.portId);
              const baudRate = (func.baudrateId);
              const funcid = (func.id);
              const postId = (func.postId);
              let countins = (func.count);
              
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
                  serialPort.write(Commands + '\r\n', (err) => {
                    if (err) {
                      console.error('Error writing to serial port:', err);
                    } else {
                      console.log('Commands sent to serial port.',Commands);
                    }
                  });
                }, 5000); // ส่งทุก 5 วินาที
                });
                let receivedData = Buffer.alloc(0);
                let dataCount = 0;
                
                serialPort.on('data', async (data) => {
                  console.log(data)
                  const newBuffer = Buffer.from(data);
                  receivedData = Buffer.concat([receivedData, newBuffer]);
                  dataCount++;

                  if (dataCount === 2) {
                    const receivedString = receivedData.toString(); // แปลงเป็น string
                    const receivedNumber = parseFloat(receivedString);
                    const formattedNumber = receivedNumber.toFixed(4); // จัดรูปแบบทศนิยม 4 หลัก
                    console.log('Received data:', formattedNumber);
                    purevalue = formattedNumber;
                    console.log(purevalue);
                    dataCount = 0;
                    receivedData = Buffer.alloc(0); // เคลียร์ Buffer สำหรับรับข้อมูลใหม่.
               

                    await instruments.update(
                      {
                        value: formattedNumber,
                      },
                      {
                        where: { id:funcid },
                      }
                    );                     
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


              //res.redirect(`/home/dashboard/${post.postId}`);
              res.redirect(`/home/dashboard/${postId}`);
            } else {
              res.send('Post not found');
            }
          };

          exports.serialportdash = async (req, res) => {
            
                const funcId = req.params.id;
                const func = await db.instruments.findByPk(funcId);
            let count = 1; 
            if (func) {
                const c2o2mmands =  ["SENSe:CHANnel 1","SENSe:PROBe 1","INIT","FETCh?"];
                const input = func.func
                const output = input.split(',').map(item => item.trim());
                const Commands = output.join('\r\n');

        
                const port =(func.portId);
                const baudRate = (func.baudrateId);
                const funcid = (func.id);
                const postId = (func.postId);
                let countins = (func.count);
                
                const serialPort = new SerialPort({path: port,
                  baudRate: baudRate, // อัตราเร็วของ Serial Port
                  dataBits: 8,
                  parity: 'none',
                  stopBits: 1,
                  flowControl: false,
                });
             
                serialPort.on('open', () => {
                  isSerialPortConnected = serialPort.isOpen;   
                  console.log('Serial Port is open.');
                  sendDataInterval = setInterval(() => {
                    serialPort.write(Commands + '\r\n', (err) => {
                      if (err) {
                        console.error('Error writing to serial port:', err);
                      } else {
                        console.log('Commands sent to serial port.',Commands);
                      }
                    });
                  }, 5000); // ส่งทุก 5 วินาที
                  });
                  let receivedData = Buffer.alloc(0);
                  let dataCount = 0;
                  
                  serialPort.on('data', async (data) => {
                    console.log(data)
                    const newBuffer = Buffer.from(data);
                    receivedData = Buffer.concat([receivedData, newBuffer]);
                    dataCount++;
  
                    if (dataCount === 2) {
                      const receivedString = receivedData.toString(); // แปลงเป็น string
                      const receivedNumber = parseFloat(receivedString);
                      const formattedNumber = receivedNumber.toFixed(4); // จัดรูปแบบทศนิยม 4 หลัก
                      console.log('Received data:', formattedNumber);
                      purevalue = formattedNumber;
                      dataCount = 0;
                      receivedData = Buffer.alloc(0); // เคลียร์ Buffer สำหรับรับข้อมูลใหม่.
                      global.myValue = purevalue;   
                       
                      await instruments.update(
                        {
                          value: formattedNumber,
                        },
                        {
                          where: { id:funcid },
                        }
                      );
                     /* if(count<=countins){
                        value.create({
                          datavalue: formattedNumber, 
                          instrumentId: funcid,
                          postId: postId,
                          countId:count++
                        })}
                        else{
                          count = 1;
                          serialPort.close(() => {
                            console.log('ปิดการเชื่อมต่อ Serial Port');
                          });
                        }*/
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
  
                //res.redirect(`/home/dashboard/${post.postId}`);
                res.redirect(`/home/dashboard/data/${funcid}`);
              } else {
                res.send('Post not found');
              }
            };

            
      exports.deletevaluedata = async (req, res) => {
        const valueId = req.params.id;
        console.log(valueId)
        if (valueId) {
          value.destroy({
            where: { instrumentId: valueId },
          });
          
          res.redirect(`/home/dashboard/data/${valueId}`);
        } else {
          res.send("Ins not found");
        }
      };

      exports.serialportstop = async (req, res) => {
        const funcId = req.params.id;
        if (isSerialPortConnected.isOpen) {
          isSerialPortConnected.close((err) => {
            if (err) {
              console.error('เกิดข้อผิดพลาดในการปิดการเชื่อมต่อ Serial Port:', err);
            } else {
              console.log('การเชื่อมต่อ Serial Port ถูกปิดแล้ว');
            }
          });
        }
        res.redirect(`/home/dashboard/data/${funcId}`);
      };


    exports.savevalue = async (req, res) => {
        const funcId = req.params.id;
        const func = await db.instruments.findByPk(funcId);
  
        if (func) {
          const maxRecords = (func.count); // จำนวนครั้งที่ต้องการบันทึก
          let counter = 1;
          let interval;
          const instrumentId = (func.id);
          const postId = (func.postId);

              interval = setInterval(saveToSequelize, 5000);
  
              function saveToSequelize() {
                  if (counter <= maxRecords) {
                      value.create({
                          datavalue: purevalue,
                          instrumentId: instrumentId,
                          postId: postId,
                          countId: counter
                      })  
                      counter++;
                  } else {
                      clearInterval(interval); // หยุด setInterval เมื่อครบจำนวนครั้งที่ต้องการ
                  }
              }
  
          res.redirect(`/home/dashboard/data/${instrumentId}`);
      } else {
          res.status(404).send('Instrument Not Found');
      }
  };


  
 exports.export = async (req, res) => {
    // สร้างส่วนหัวของตาราง XLSX
    try {
      const FuncId = req.params.id;

     const data = await value.findAll({
      where: { instrumentId: FuncId  },
      order: [['id', 'ASC']],
    });
      
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    }
    // ดึงข้อมูลหัวคอลัมน์จาก db.instruments
    const func = await instruments.findOne({
      where: {
        id: FuncId
      },
      attributes: ['funcname','portId','baudrateId','id','count','postId'], // เลือกเฉพาะคอลัมน์ port
    });

    const ins = await Post.findOne({
      where: {
        id: func.postId
      },
      attributes: ['title','id'], // เลือกเฉพาะคอลัมน์ port
    });

    // สร้างไฟล์ Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    // เพิ่มข้อมูลของหัวข้อกำหนดเอง (แถวที่ 1)
    worksheet.spliceRows(1, 0, ['','ID : '+ins.id,'INSTRUMENT : '+ins.title]);
    // เพิ่มข้อมูลของหัวข้อกำหนดเอง (แถวที่ 2)
    worksheet.spliceRows(2, 0, ['','ID : '+ func.id,'FUNCTION : '+func.funcname,'PORT : '+func.portId,'BAUDRATE : '+func.baudrateId,'COUNT : '+func.count]);
    // เพิ่มข้อมูลลงในไฟล์ Excel
    worksheet.spliceRows(3, 0, ['ID', 'Value', 'Date']);
    data.forEach(item => {
      worksheet.addRow([item.countId, item.datavalue, item.createdAt.toLocaleString('th-TH')]); // เพิ่มข้อมูล
      
    });
   
    // ตั้งค่าส่งไฟล์ .xlsx ให้กับไคลเอนต์
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    // ส่งไฟล์ .xlsx กลับไปยังไคลเอนต์
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'มีข้อผิดพลาดในการดาวน์โหลด .xlsx' });
  }
};