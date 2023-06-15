const sampleController = {
    getSampleData: (req, res) => {
      res.json({ message: 'Sample data from the controller' });
    },
  };
  
  module.exports = sampleController;
  