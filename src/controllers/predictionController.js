const { v4: uuidv4 } = require('uuid');
const tf = require('@tensorflow/tfjs-node');
const db = require('../config/firebase');
const loadModel = require('../model/modelLoader');
const { validateFileSize } = require('../utils/fileValidator');

const predict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }

    if (!validateFileSize(req.file.size)) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    }

    const buffer = req.file.buffer;
    const model = await loadModel();

    const tensor = tf.node
      .decodeImage(buffer, 3)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims(0);

    const predictions = model.predict(tensor).dataSync();
    const result = predictions[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    const suggestion =
      result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const predictionData = { id, result, suggestion, createdAt };
    await db.collection('predictions').doc(id).set(predictionData);

    res.status(200).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data: predictionData,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(400).json({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi',
    });
  }
};

module.exports = { predict };
