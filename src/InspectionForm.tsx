import React, { useState, useEffect } from "react";

interface InspectionResult {
  status?: "pass" | "fail";
  notes?: string;
  image?: string;
}

const inspectionPoints = [
  "Engine Oil Level & Condition",
  "Oil Filter Replacement",
  "Air Filter Condition",
  "Tire Pressure & Condition",
  "Brake Fluid Level",
  "Power Steering Fluid",
  "Transmission Fluid",
  "Coolant Level & Condition",
  "Windshield Washer Fluid",
  "Battery Condition",
  "Belts & Hoses",
  "Wiper Blades",
  "Exterior Lights",
  "Cabin Air Filter",
  "Brake Pad Wear",
];

const InspectionPage: React.FC = () => {
  const [vin, setVin] = useState("");
  const [mileage, setMileage] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [inspectionResults, setInspectionResults] = useState<Record<number, InspectionResult>>({});
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Update the count of completed items whenever results change
    const completed = Object.keys(inspectionResults).filter(
      (key) => inspectionResults[Number(key)]?.status
    ).length;
    setCompletedCount(completed);
  }, [inspectionResults]);

  const handleStatusChange = (index: number, status: "pass" | "fail") => {
    setInspectionResults((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        status,
      },
    }));
  };

  const handleNotesChange = (index: number, notes: string) => {
    setInspectionResults((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        notes,
      },
    }));
  };

  const handleImageUpload = (index: number, file: File | null) => {
    setInspectionResults((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        image: file?.name || "",
      },
    }));
  };

  const submitInspection = () => {
    if (!vin || !mileage || !date) {
      alert("Please fill in all vehicle information fields.");
      return;
    }

    if (completedCount < 15) {
      alert(`Please complete all inspection points. (${completedCount}/15 completed)`);
      return;
    }

    const failedItems = Object.entries(inspectionResults)
      .filter(([_, value]) => value.status === "fail")
      .map(([key, _]) => inspectionPoints[Number(key)]);

    if (failedItems.length > 0) {
      alert(`The following items need attention:\n${failedItems.join("\n")}`);
    } else {
      alert("Inspection completed successfully! All points passed.");
    }

    console.log("Final Inspection Results:", {
      vin,
      mileage,
      date,
      inspectionResults,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <div style={styles.header}>
          <h1>15-Point Oil Change Inspection</h1>
          <p>Complete inspection checklist for quality assurance</p>
        </div>

        <div style={styles.vehicleInfo}>
          <input
            type="text"
            placeholder="VIN Number"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Current Mileage"
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            style={styles.input}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.completionStatus}>
          Points completed: {completedCount}/15
        </div>

        <div style={styles.inspectionGrid}>
          {inspectionPoints.map((point, index) => (
            <div key={index} style={styles.inspectionItem}>
              <h3>{index + 1}. {point}</h3>
              <div style={styles.statusButtons}>
                <button
                  style={{
                    ...styles.statusButton,
                    ...(inspectionResults[index]?.status === "pass" ? styles.passSelected : styles.pass),
                  }}
                  onClick={() => handleStatusChange(index, "pass")}
                >
                  Pass
                </button>
                <button
                  style={{
                    ...styles.statusButton,
                    ...(inspectionResults[index]?.status === "fail" ? styles.failSelected : styles.fail),
                  }}
                  onClick={() => handleStatusChange(index, "fail")}
                >
                  Fail
                </button>
              </div>
              <textarea
                placeholder="Add notes here..."
                onChange={(e) => handleNotesChange(index, e.target.value)}
                style={styles.textarea}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
                style={styles.fileInput}
              />
            </div>
          ))}
        </div>

        <div style={styles.submitSection}>
          <button style={styles.submitButton} onClick={submitInspection}>
            Complete Inspection
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#f0f0f0",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    maxWidth: "800px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "100%",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  vehicleInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
  },
  completionStatus: {
    textAlign: "right" as const,
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  inspectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  inspectionItem: {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
    borderLeft: "4px solid #3498db",
  },
  statusButtons: {
    display: "flex",
    gap: "10px",
  },
  statusButton: {
    flex: 1,
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  pass: {
    background: "#2ecc71",
    color: "#fff",
    opacity: 0.7,
  },
  fail: {
    background: "#e74c3c",
    color: "#fff",
    opacity: 0.7,
  },
  passSelected: {
    opacity: 1,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  failSelected: {
    opacity: 1,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    resize: "vertical" as const,
    marginTop: "10px",
  },
  fileInput: {
    marginTop: "10px",
  },
  submitSection: {
    textAlign: "center" as const,
    marginTop: "30px",
  },
  submitButton: {
    background: "#3498db",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default InspectionPage;
