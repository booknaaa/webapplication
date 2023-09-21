module.exports = {
    getSerialData: (req, res) => {
      res.json({ data: global.myValue });
    },
  };