const tf = require('@tensorflow/tfjs-node');

let model;
const loadModel = async () => {
  if (!model) {
    console.log('Loading TensorFlow model...');
    model = await tf.loadLayersModel('https://storage.googleapis.com/submissionmlgc-ahmadyudha/submissions-model/model.json');
    console.log('Model loaded successfully');
  }
  return model;
};

module.exports = loadModel;
