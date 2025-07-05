const { Op } = require('sequelize');
const Analysis = require('../models/Analysis');
const User = require('../models/User');

// ✅ Get all analyses with optional search and label filters
const getAllAnalyses = async (req, res) => {
  try {
    const { search = '', label = '' } = req.query;

    const whereClause = {
      ...(search && { sentence: { [Op.iLike]: `%${search}%` } }),
      ...(label && { label })
    };

    const analyses = await Analysis.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['name'] }],
      order: [['created_at', 'DESC']]
    });

    const data = analyses.map(a => ({
      id: a.id,
      sentence: a.sentence,
      label: a.label,
      confidence: a.confidence,
      userName: a.User.name,
      createdAt: a.created_at
    }));

    res.json(data);
  } catch (err) {
    console.error('Error fetching analyses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Edit analysis label
const updateAnalysisLabel = async (req, res) => {
  const { id } = req.params;
  const { newLabel } = req.body;

  try {
    const analysis = await Analysis.findByPk(id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });

    analysis.label = newLabel;
    await analysis.save();

    res.json({ message: 'Label updated' });
  } catch (err) {
    console.error('Error updating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete an analysis
const deleteAnalysis = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Analysis.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Analysis not found' });

    res.json({ message: 'Analysis deleted' });
  } catch (err) {
    console.error('Error deleting analysis:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// ✅ File Upload Logs (Dummy Example)
const getFileUploadLogs = async (req, res) => {
  try {
    const logs = [
      {
        id: 1,
        userName: "Shahd",
        fileName: "file1.txt",
        sentenceCount: 10,
        successfulAnalysisCount: 9,
        dominantEmotion: "Hope"
      },
      {
        id: 2,
        userName: "Leen",
        fileName: "data.csv",
        sentenceCount: 15,
        successfulAnalysisCount: 14,
        dominantEmotion: "Love"
      }
    ];
    res.json(logs);
  } catch (err) {
    console.error('Error fetching file logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getAllAnalyses,
  updateAnalysisLabel,
  deleteAnalysis,
    getFileUploadLogs 
};
