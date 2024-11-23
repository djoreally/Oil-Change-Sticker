import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentMileage, setCurrentMileage] = useState('');
  const [oilType, setOilType] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [nextServiceInfo, setNextServiceInfo] = useState<string>('');
  const [reminderSet, setReminderSet] = useState(false);

  // Set today as the minimum date for the service date input
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setServiceDate(today);
  }, []);

  const handleSaveReminder = () => {
    if (!currentMileage || !oilType || !serviceDate) {
      alert('Please fill in all fields');
      return;
    }

    // Calculate next service date (3 months from service date)
    const nextServiceDate = new Date(serviceDate);
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);

    // Calculate next service mileage (3000 miles from current)
    const nextServiceMileage = parseInt(currentMileage) + 3000;

    setNextServiceInfo(`
      Date: ${nextServiceDate.toLocaleDateString()} 
      or at ${nextServiceMileage.toLocaleString()} miles 
      (whichever comes first)
    `);

    setReminderSet(true);

    // Attempt to add to calendar if supported
    if ('scheduling' in window) {
      const calendarEvent = {
        title: "Oil Change Due - MOM'S Mobile Oil Change",
        start: nextServiceDate,
        duration: 60, // 1 hour
        description: `Oil change due! Current mileage: ${currentMileage}, Oil type: ${oilType}`
      };
      
      try {
        window.scheduling.createEvent(calendarEvent);
      } catch (e) {
        console.log('Calendar integration not supported');
      }
    }
  };

  return (
    <div className="sticker">
      <div className="logo">
        <h2>MOM'S Mobile Oil Change</h2>
      </div>

      <div className="form-group">
        <label>Current Mileage:</label>
        <input
          type="number"
          id="currentMileage"
          value={currentMileage}
          onChange={(e) => setCurrentMileage(e.target.value)}
          placeholder="Enter current mileage"
        />
      </div>

      <div className="form-group">
        <label>Oil Type:</label>
        <select
          id="oilType"
          value={oilType}
          onChange={(e) => setOilType(e.target.value)}
        >
          <option value="">Select Oil Type</option>
          <option value="5W-30">5W-30</option>
          <option value="10W-40">10W-40</option>
          <option value="5W-20">5W-20</option>
          <option value="0W-20">0W-20</option>
          <option value="15W-40">15W-40</option>
          <option value="20W-50">20W-50</option>
        </select>
      </div>

      <div className="form-group">
        <label>Service Date:</label>
        <input
          type="date"
          id="serviceDate"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
        />
      </div>

      <div className="next-service">
        <h3>Next Service Due:</h3>
        <p id="nextServiceInfo">{nextServiceInfo || 'Calculate your next service...'}</p>
      </div>

      <div className="qr-section">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="#000" strokeWidth="2" />
          <path d="M20 20h20v20h-20z M60 20h20v20h-20z M20 60h20v20h-20z" fill="#000" />
          <path d="M45 45h10v10h-10z M60 60h5v5h-5z M70 70h10v10h-10z" fill="#000" />
        </svg>
        <p>Scan to schedule your next service!</p>
      </div>

      <button className="save-btn" onClick={handleSaveReminder}>Save Reminder</button>
      {reminderSet && <p className="reminder-set">✓ Reminder has been set!</p>}
    </div>
  );
};

export default App;
