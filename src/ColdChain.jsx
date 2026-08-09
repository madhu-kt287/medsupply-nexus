import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Hospital,
  MapPin,
  Phone,
  Snowflake,
  Thermometer,
  Truck,
} from "lucide-react";
import "./ColdChain.css";

const shipments = [
  {
    id: "MS-2048",
    medicine: "Amoxicillin 500mg",
    from: "CityCare Hospital",
    to: "District Medical Centre",
    temperature: 4.8,
    eta: "42 min",
    status: "Safe",
  },
  {
    id: "MS-2051",
    medicine: "Insulin Glargine",
    from: "Central Hospital",
    to: "CityCare Hospital",
    temperature: 5.4,
    eta: "1 hr 18 min",
    status: "Safe",
  },
  {
    id: "MS-2056",
    medicine: "MMR Vaccine",
    from: "Regional Medical Store",
    to: "District Medical Centre",
    temperature: 7.1,
    eta: "56 min",
    status: "Monitoring",
  },
];

function ColdChain() {
  const [selectedShipment, setSelectedShipment] = useState(shipments[0]);
  const [temperature, setTemperature] = useState(4.8);
  const [anomaly, setAnomaly] = useState(false);

  const simulateTemperatureAlert = () => {
    setTemperature(9.4);
    setAnomaly(true);
  };

  const restoreTemperature = () => {
    setTemperature(4.8);
    setAnomaly(false);
  };

  const isSafe = temperature >= 2 && temperature <= 8;

  return (
    <div className="coldchain-page">
      <div className="coldchain-header">
        <div>
          <div className="coldchain-kicker">
            <Snowflake size={16} />
            COLDCHAIN SENTINEL
          </div>

          <h1>Temperature Intelligence</h1>

          <p>
            Monitor temperature-sensitive medical shipments and detect
            cold-chain risks before medicines are compromised.
          </p>
        </div>

        <div className={`network-status ${isSafe ? "safe" : "danger"}`}>
          <span></span>
          {isSafe ? "Network Protected" : "Critical Alert"}
        </div>
      </div>

      {/* ALERT */}
      {anomaly && (
        <div className="cold-alert">
          <div className="cold-alert-icon">
            <AlertTriangle size={23} />
          </div>

          <div className="cold-alert-content">
            <strong>Temperature excursion detected</strong>

            <p>
              Shipment {selectedShipment.id} has exceeded the safe
              pharmaceutical temperature range.
            </p>
          </div>

          <button onClick={restoreTemperature}>
            Restore Simulation
          </button>
        </div>
      )}

      {/* TOP CARDS */}
      <div className="cold-stats">
        <div className="cold-stat-card">
          <div className="cold-stat-icon blue">
            <Snowflake size={20} />
          </div>

          <div>
            <span>Active Shipments</span>
            <strong>12</strong>
            <small>Currently monitored</small>
          </div>
        </div>

        <div className="cold-stat-card">
          <div className="cold-stat-icon green">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Temperature Safe</span>
            <strong>10</strong>
            <small>Within 2°C — 8°C</small>
          </div>
        </div>

        <div className="cold-stat-card">
          <div className="cold-stat-icon orange">
            <Thermometer size={20} />
          </div>

          <div>
            <span>Monitoring</span>
            <strong>1</strong>
            <small>Needs attention</small>
          </div>
        </div>

        <div className="cold-stat-card">
          <div className="cold-stat-icon red">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Critical Alerts</span>
            <strong>{anomaly ? "1" : "0"}</strong>
            <small>Requires intervention</small>
          </div>
        </div>
      </div>

      <div className="cold-main-grid">

        {/* SHIPMENT LIST */}
        <div className="cold-panel shipment-list-panel">
          <div className="cold-panel-header">
            <div>
              <span>LIVE MONITORING</span>
              <h2>Active Shipments</h2>
            </div>

            <div className="live-pill">
              <span></span>
              LIVE
            </div>
          </div>

          <div className="shipment-list">
            {shipments.map((shipment) => (
              <button
                key={shipment.id}
                className={`shipment-item ${
                  selectedShipment.id === shipment.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedShipment(shipment);

                  if (shipment.id !== "MS-2048") {
                    setTemperature(shipment.temperature);
                    setAnomaly(false);
                  } else {
                    setTemperature(4.8);
                    setAnomaly(false);
                  }
                }}
              >
                <div className="shipment-icon">
                  <Truck size={19} />
                </div>

                <div className="shipment-info">
                  <strong>{shipment.id}</strong>
                  <span>{shipment.medicine}</span>
                </div>

                <div className="shipment-temperature">
                  <strong>{shipment.temperature}°C</strong>
                  <span>{shipment.status}</span>
                </div>

                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </div>

        {/* TEMPERATURE MONITOR */}
        <div className="cold-panel temperature-panel">

          <div className="cold-panel-header">
            <div>
              <span>SHIPMENT TEMPERATURE</span>
              <h2>#{selectedShipment.id}</h2>
            </div>

            <div className={`temperature-status ${isSafe ? "safe" : "danger"}`}>
              {isSafe ? (
                <>
                  <CheckCircle2 size={15} />
                  SAFE
                </>
              ) : (
                <>
                  <AlertTriangle size={15} />
                  CRITICAL
                </>
              )}
            </div>
          </div>

          <div className={`temperature-display ${!isSafe ? "danger" : ""}`}>
            <div className="temperature-icon">
              <Thermometer size={29} />
            </div>

            <div>
              <span>Current temperature</span>
              <strong>{temperature.toFixed(1)}°C</strong>
              <small>Safe range: 2°C — 8°C</small>
            </div>
          </div>

          {/* GRAPH */}
          <div className="temperature-chart">
            <div className="chart-label">
              <span>Temperature history</span>
              <span>Last 60 minutes</span>
            </div>

            <div className="chart-area">
              <div className="safe-zone"></div>

              <div className="chart-line">
                <span style={{ left: "3%", bottom: "45%" }}></span>
                <span style={{ left: "13%", bottom: "50%" }}></span>
                <span style={{ left: "23%", bottom: "43%" }}></span>
                <span style={{ left: "33%", bottom: "48%" }}></span>
                <span style={{ left: "43%", bottom: "46%" }}></span>
                <span style={{ left: "53%", bottom: "52%" }}></span>
                <span style={{ left: "63%", bottom: "47%" }}></span>
                <span style={{ left: "73%", bottom: "54%" }}></span>
                <span
                  style={{
                    left: "83%",
                    bottom: anomaly ? "87%" : "49%",
                  }}
                ></span>
                <span
                  style={{
                    left: "94%",
                    bottom: anomaly ? "92%" : "51%",
                  }}
                ></span>
              </div>
            </div>

            <div className="chart-axis">
              <span>60m</span>
              <span>45m</span>
              <span>30m</span>
              <span>15m</span>
              <span>Now</span>
            </div>
          </div>

          <div className="temperature-actions">
            <button
              className="simulate-alert-button"
              onClick={simulateTemperatureAlert}
            >
              <AlertTriangle size={17} />
              Simulate Temperature Alert
            </button>
          </div>
        </div>
      </div>

      {/* SHIPMENT DETAILS */}
      <div className="cold-bottom-grid">

        <div className="cold-panel route-panel">
          <div className="cold-panel-header">
            <div>
              <span>SHIPMENT ROUTE</span>
              <h2>Medical Transfer</h2>
            </div>
          </div>

          <div className="route-flow">

            <div className="route-location">
              <div className="route-icon">
                <Hospital size={19} />
              </div>

              <div>
                <span>ORIGIN</span>
                <strong>{selectedShipment.from}</strong>
                <small>
                  <MapPin size={12} />
                  Chennai, Tamil Nadu
                </small>
              </div>
            </div>

            <div className="route-line">
              <div></div>
              <Truck size={19} />
              <div></div>
            </div>

            <div className="route-location">
              <div className="route-icon">
                <Hospital size={19} />
              </div>

              <div>
                <span>DESTINATION</span>
                <strong>{selectedShipment.to}</strong>
                <small>
                  <MapPin size={12} />
                  Chennai, Tamil Nadu
                </small>
              </div>
            </div>
          </div>

          <div className="route-meta">
            <div>
              <span>MEDICINE</span>
              <strong>{selectedShipment.medicine}</strong>
            </div>

            <div>
              <span>EST. ARRIVAL</span>
              <strong>{selectedShipment.eta}</strong>
            </div>
          </div>
        </div>

        {/* AI ASSESSMENT */}
        <div className={`cold-panel ai-cold-panel ${!isSafe ? "critical" : ""}`}>
          <div className="ai-cold-title">
            <div className="ai-brain">
              ✦
            </div>

            <div>
              <span>AI COLDCHAIN INTELLIGENCE</span>
              <h2>Shipment Risk Assessment</h2>
            </div>
          </div>

          {isSafe ? (
            <>
              <div className="ai-result safe-result">
                <CheckCircle2 size={21} />

                <div>
                  <strong>Low Risk</strong>
                  <p>
                    Temperature is stable and within the recommended
                    pharmaceutical storage range.
                  </p>
                </div>
              </div>

              <div className="ai-recommendation">
                <span>AI RECOMMENDATION</span>

                <p>
                  Continue current route. No intervention required.
                  Temperature monitoring should remain active until delivery.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="ai-result danger-result">
                <AlertTriangle size={21} />

                <div>
                  <strong>High Risk</strong>
                  <p>
                    Temperature has reached {temperature.toFixed(1)}°C,
                    exceeding the safe upper threshold.
                  </p>
                </div>
              </div>

              <div className="ai-recommendation danger-recommendation">
                <span>AI RECOMMENDATION</span>

                <p>
                  Immediately inspect the shipment, notify the receiving
                  hospital and evaluate medicine quality before administration.
                </p>
              </div>
            </>
          )}

          <div className="ai-confidence">
            <span>AI CONFIDENCE</span>

            <strong>{isSafe ? "96%" : "98%"}</strong>
          </div>
        </div>
      </div>

      {/* HOSPITAL CONTACT */}
      <div className="cold-panel hospital-contact">
        <div className="hospital-contact-icon">
          <Hospital size={23} />
        </div>

        <div className="hospital-contact-info">
          <span>RECEIVING FACILITY</span>
          <strong>{selectedShipment.to}</strong>
          <small>
            <MapPin size={13} />
            Chennai, Tamil Nadu
          </small>
        </div>

        <div className="hospital-contact-actions">
          <button>
            <Phone size={16} />
            Contact Hospital
          </button>

          <button>
            View Shipment Details
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="cold-footer">
        <span>MedSupply Nexus • ColdChain Sentinel</span>
        <span>Predict • Monitor • Protect</span>
      </div>
    </div>
  );
}

export default ColdChain;