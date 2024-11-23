import React, { useState, useEffect } from 'react';

const OilChangeReminder: React.FC = () => {
  const [currentMileage, setCurrentMileage] = useState<string>('');
  const [oilType, setOilType] = useState<string>('');
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [nextServiceInfo, setNextServiceInfo] = useState<string>('Calculate your next service...');
  const [reminderSet, setReminderSet] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setServiceDate(today);
  }, []);

  const saveReminder = async () => {
    if (!currentMileage || !oilType || !serviceDate || !phoneNumber) {
      alert('Please fill in all fields');
      return;
    }

    const nextServiceDate = new Date(serviceDate);
    nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);

    const nextServiceMileage = parseInt(currentMileage) + 3000;

    // Set next service info
    setNextServiceInfo(`
      Date: ${nextServiceDate.toLocaleDateString()} 
      or at ${nextServiceMileage.toLocaleString()} miles
      (whichever comes first)
    `);

    setReminderSet(true);

    // Save data to the backend (using POST)
    try {
      await fetch('http://localhost:5000/api/oil-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          currentMileage,
          oilType,
          serviceDate,
          nextServiceMileage,
          nextServiceDate,
        }),
      });
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const searchReminders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/oil-changes?search=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      {/* Form Fields */}
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <label>Current Mileage:</label>
        <input
          type="number"
          value={currentMileage}
          onChange={(e) => setCurrentMileage(e.target.value)}
        />
      </div>

      <div>
        <label>Oil Type:</label>
        <input
          type="text"
          value={oilType}
          onChange={(e) => setOilType(e.target.value)}
        />
      </div>

      <div>
        <label>Service Date:</label>
        <input
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
        />
      </div>

      <button onClick={saveReminder}>Save Reminder</button>

      <div>
        <h3>Next Service Info:</h3>
        <p>{nextServiceInfo}</p>
      </div>

      {/* Search Feature */}
      <div>
        <label>Search Reminders:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchReminders}>Search</button>
      </div>

      <div>
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index}>
              <p>Phone Number: {result.phoneNumber}</p>
              <p>Service Date: {result.serviceDate}</p>
              <p>Mileage: {result.currentMileage}</p>
              <p>Oil Type: {result.oilType}</p>
              <p>Next Service: {result.nextServiceDate}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default OilChangeReminder;
