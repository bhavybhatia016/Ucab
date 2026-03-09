
const getNearbyCabs = async (req, res) => {
  try {
    const { lat, lng } = req.query;

  
    const nearbyCabs = Array.from({ length: 6 }, (_, i) => ({
      id: `cab_${i + 1}`,
      type: ['economy', 'comfort', 'premium', 'xl'][i % 4],
      driver: `Driver ${i + 1}`,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      eta: Math.round(Math.random() * 10 + 2),
      lat: parseFloat(lat) + (Math.random() - 0.5) * 0.05,
      lng: parseFloat(lng) + (Math.random() - 0.5) * 0.05,
      vehicle: ['Swift', 'Honda City', 'Innova', 'BMW'][i % 4]
    }));

    res.json(nearbyCabs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNearbyCabs };