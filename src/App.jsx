import { useState } from "react";

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  Brain,
  ChevronRight,
  Clock3,
  Droplets,
  Hospital,
  Package,
  Snowflake,
  Truck,
  TrendingDown,
  TrendingUp,
  MapPin,
  Phone,
  ShieldCheck,
  Thermometer,
  Activity,
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  X,
  BellRing,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

/* =========================================================
   INITIAL HOSPITAL DATA
========================================================= */

const initialHospitals = [
  {
    id: "citycare",
    name: "CityCare Hospital",
    position: [13.0475, 80.2125],
    status: "SURPLUS",
    stock: 480,
    medicine: "Amoxicillin 500mg",
    address: "Health Park Road, Demo Network",
    phone: "+91 90000 10001",
  },
  {
    id: "district",
    name: "District Medical Centre",
    position: [13.0827, 80.2707],
    status: "CRITICAL",
    stock: 84,
    medicine: "Amoxicillin 500mg",
    address: "Central Health Avenue, Demo Network",
    phone: "+91 90000 10002",
  },
  {
    id: "central",
    name: "Central Hospital",
    position: [13.0569, 80.2425],
    status: "AT RISK",
    stock: 230,
    medicine: "Insulin Glargine",
    address: "Medical Campus Road, Demo Network",
    phone: "+91 90000 10003",
  },
];

/* =========================================================
   INITIAL DEMO RISKS
========================================================= */

const initialRisks = [
  {
    id: "amoxicillin",
    medicine: "Amoxicillin 500mg",
    hospital: "District Medical Centre",
    stock: 84,
    days: "1.4 days",
    status: "Critical",
  },
  {
    id: "insulin",
    medicine: "Insulin Glargine",
    hospital: "Central Hospital",
    stock: 230,
    days: "7.2 days",
    status: "At Risk",
  },
  {
    id: "mmr",
    medicine: "Vaccine — MMR",
    hospital: "CityCare Hospital",
    stock: 480,
    days: "21 days",
    status: "Expiry Risk",
  },
];

/* =========================================================
   MAP MARKER
========================================================= */

const createHospitalIcon = (status) =>
  L.divIcon({
    className: "custom-hospital-marker",
    html: `
      <div class="map-marker ${
        status === "CRITICAL"
          ? "marker-critical"
          : status === "SURPLUS"
            ? "marker-surplus"
            : "marker-risk"
      }">
        <span>+</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -20],
  });

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  /*
    SHARED TRANSFER STATE

    This is the single source of truth for the demo transfer.
  */
  const [transferStarted, setTransferStarted] = useState(false);

  /*
    SHARED HOSPITAL INVENTORY
  */
  const [hospitals, setHospitals] = useState(initialHospitals);

  /*
    SHARED RISK DATA
  */
  const [risks, setRisks] = useState(initialRisks);

  /*
    NOTIFICATION PANEL
  */
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  /*
    AI COPILOT STATE
  */
  const [copilotAnswer, setCopilotAnswer] = useState(
    "I can analyze medicine shortages, redistribution opportunities and cold-chain risks across the network."
  );

  const [copilotQuestion, setCopilotQuestion] = useState("");

  /*
    NAVIGATION
  */
  const navigate = (page) => {
    setActivePage(page);
    setNotificationsOpen(false);
  };

  /* =========================================================
     INITIATE TRANSFER
  ========================================================= */

  const initiateTransfer = () => {
    /*
      Do nothing if transfer is already active.
      This prevents duplicate transfers.
    */
    if (transferStarted) {
      return;
    }

    setTransferStarted(true);

    /*
      Update CityCare:
      480 -> 360
    */

    /*
      Update District:
      84 -> 204
    */

    setHospitals((currentHospitals) =>
      currentHospitals.map((hospital) => {
        if (hospital.id === "citycare") {
          return {
            ...hospital,
            stock: 360,
            status: "SURPLUS",
          };
        }

        if (hospital.id === "district") {
          return {
            ...hospital,
            stock: 204,
            status: "AT RISK",
          };
        }

        return hospital;
      })
    );

    /*
      Update shared risk.
    */

    setRisks((currentRisks) =>
      currentRisks.map((risk) => {
        if (risk.id === "amoxicillin") {
          return {
            ...risk,
            stock: 204,
            days: "3.4 days",
            status: "At Risk",
          };
        }

        return risk;
      })
    );

    /*
      Update AI message.
    */

    setCopilotAnswer(
      "Transfer initiated successfully. 120 units of Amoxicillin 500mg are now in transit from CityCare Hospital to District Medical Centre."
    );
  };

  /* =========================================================
     RESET DEMO
  ========================================================= */

  const resetDemo = () => {
    /*
      Restore the original demo state.
    */

    setTransferStarted(false);
    setHospitals(initialHospitals);
    setRisks(initialRisks);

    setCopilotAnswer(
      "Demo reset successfully. District Medical Centre is again showing a critical Amoxicillin shortage and CityCare Hospital has its original surplus."
    );

    setCopilotQuestion("");

    setNotificationsOpen(false);
  };

  /* =========================================================
     AI COPILOT ACTIONS
  ========================================================= */

  const handleCopilotQuestion = (question) => {
    setCopilotQuestion(question);

    let answer = "";

    if (question === "Which medicine is at highest risk?") {
      answer = transferStarted
        ? "Amoxicillin 500mg was the highest-risk medicine. The 120-unit redistribution is now active, increasing District Medical Centre's stock to 204 units and reducing the immediate shortage risk."
        : "Amoxicillin 500mg is currently the highest-risk medicine. District Medical Centre has only 84 units, representing approximately 1.4 days of coverage.";
    }

    if (question === "Where should we redistribute stock?") {
      answer = transferStarted
        ? "The recommended redistribution has already been initiated: 120 units are moving from CityCare Hospital to District Medical Centre."
        : "The strongest redistribution opportunity is CityCare Hospital to District Medical Centre. CityCare has surplus Amoxicillin while District Medical Centre is approaching a critical shortage.";
    }

    if (question === "Which shipment needs attention?") {
      answer =
        "The Insulin Glargine cold-chain shipment requires attention because its temperature is currently 9.4°C, above the safe 2°C–8°C range. The recommended action is to quarantine the affected batch and initiate a replacement shipment.";
    }

    if (question === "What action should we take first?") {
      answer = transferStarted
        ? "The first recommended action has already been completed. The Amoxicillin redistribution is currently in transit. The next action is to monitor delivery and confirm receipt at District Medical Centre."
        : "The first recommended action is to transfer 120 units of Amoxicillin 500mg from CityCare Hospital to District Medical Centre before the projected shortage threshold.";
    }

    setCopilotAnswer(answer);
  };

  const handleCopilotSend = () => {
    const question = copilotQuestion.trim();

    if (!question) {
      return;
    }

    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("highest") ||
      lowerQuestion.includes("risk")
    ) {
      handleCopilotQuestion("Which medicine is at highest risk?");
      return;
    }

    if (
      lowerQuestion.includes("redistribute") ||
      lowerQuestion.includes("transfer") ||
      lowerQuestion.includes("stock")
    ) {
      handleCopilotQuestion(
        "Where should we redistribute stock?"
      );
      return;
    }

    if (
      lowerQuestion.includes("shipment") ||
      lowerQuestion.includes("temperature") ||
      lowerQuestion.includes("cold")
    ) {
      handleCopilotQuestion(
        "Which shipment needs attention?"
      );
      return;
    }

    if (
      lowerQuestion.includes("action") ||
      lowerQuestion.includes("first") ||
      lowerQuestion.includes("next")
    ) {
      handleCopilotQuestion(
        "What action should we take first?"
      );
      return;
    }

    setCopilotAnswer(
      transferStarted
        ? "The network is currently managing an active Amoxicillin redistribution. 120 units are in transit from CityCare Hospital to District Medical Centre. The next priority is delivery monitoring."
        : "Based on the current network state, the highest priority is the Amoxicillin shortage at District Medical Centre. I recommend reviewing the CityCare-to-District redistribution."
    );
  };

  /*
    Dashboard statistics.
  */

  const criticalRiskCount = risks.filter(
    (risk) => risk.status === "Critical"
  ).length;

  /*
    Existing demo transfers + this transfer.
  */

  const activeTransferCount = transferStarted ? 5 : 4;

  return (
    <div className="app-shell">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Hospital size={22} />
          </div>

          <div>
            <h1>MedSupply</h1>
            <span>NEXUS</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">COMMAND CENTER</p>

          <NavButton
            icon={<Boxes size={18} />}
            label="Dashboard"
            activePage={activePage}
            navigate={navigate}
          />

          <NavButton
            icon={<Package size={18} />}
            label="Supply Intelligence"
            activePage={activePage}
            navigate={navigate}
          />

          <NavButton
            icon={<Truck size={18} />}
            label="Redistribution"
            activePage={activePage}
            navigate={navigate}
          />

          <NavButton
            icon={<Snowflake size={18} />}
            label="ColdChain Sentinel"
            activePage={activePage}
            navigate={navigate}
          />

          <NavButton
            icon={<Hospital size={18} />}
            label="Hospital Network"
            activePage={activePage}
            navigate={navigate}
          />

          <NavButton
            icon={<Brain size={18} />}
            label="AI Copilot"
            activePage={activePage}
            navigate={navigate}
          />
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              HEALTHCARE SUPPLY INTELLIGENCE
            </p>

            <h2>{activePage}</h2>
          </div>

          <div className="topbar-actions">
            {/* =================================================
                WORKING NOTIFICATION BUTTON
            ================================================= */}

            <div className="notification-wrapper">
              <button
                className="icon-button"
                onClick={() =>
                  setNotificationsOpen(
                    (current) => !current
                  )
                }
                aria-label="Open notifications"
              >
                {transferStarted ? (
                  <BellRing size={19} />
                ) : (
                  <Bell size={19} />
                )}

                <span className="notification-dot"></span>
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <div>
                      <strong>Notifications</strong>
                      <span>Network updates</span>
                    </div>

                    <button
                      className="notification-close"
                      onClick={() =>
                        setNotificationsOpen(false)
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {!transferStarted ? (
                    <button
                      className="notification-item"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("Redistribution");
                      }}
                    >
                      <div className="notification-icon warning">
                        <AlertTriangle size={17} />
                      </div>

                      <div>
                        <strong>
                          Amoxicillin shortage detected
                        </strong>

                        <span>
                          District Medical Centre has
                          approximately 1.4 days of coverage.
                        </span>
                      </div>
                    </button>
                  ) : (
                    <button
                      className="notification-item"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("Redistribution");
                      }}
                    >
                      <div className="notification-icon success">
                        <Truck size={17} />
                      </div>

                      <div>
                        <strong>
                          Transfer is in transit
                        </strong>

                        <span>
                          120 units are moving to District
                          Medical Centre.
                        </span>
                      </div>
                    </button>
                  )}

                  <button
                    className="notification-item"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("ColdChain Sentinel");
                    }}
                  >
                    <div className="notification-icon danger">
                      <Thermometer size={17} />
                    </div>

                    <div>
                      <strong>
                        Cold-chain alert
                      </strong>

                      <span>
                        Insulin Glargine shipment requires
                        attention.
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="profile">
              <div className="avatar">OP</div>

              <div className="profile-text">
                <strong>Operations</strong>
                <span>Supply Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGES
        =================================================== */}

        {activePage === "Dashboard" && (
          <Dashboard
            risks={risks}
            criticalRiskCount={criticalRiskCount}
            activeTransferCount={activeTransferCount}
            transferStarted={transferStarted}
            navigate={navigate}
          />
        )}

        {activePage === "Supply Intelligence" && (
          <SupplyIntelligence
            risks={risks}
            transferStarted={transferStarted}
          />
        )}

        {activePage === "Redistribution" && (
          <Redistribution
            hospitals={hospitals}
            transferStarted={transferStarted}
            initiateTransfer={initiateTransfer}
            activeTransferCount={activeTransferCount}
            resetDemo={resetDemo}
          />
        )}

        {activePage === "ColdChain Sentinel" && (
          <ColdChain />
        )}

        {activePage === "Hospital Network" && (
          <HospitalNetwork
            hospitals={hospitals}
            navigate={navigate}
          />
        )}

        {activePage === "AI Copilot" && (
          <AICopilot
            hospitals={hospitals}
            risks={risks}
            transferStarted={transferStarted}
            copilotAnswer={copilotAnswer}
            copilotQuestion={copilotQuestion}
            setCopilotQuestion={setCopilotQuestion}
            handleCopilotQuestion={handleCopilotQuestion}
            handleCopilotSend={handleCopilotSend}
            navigate={navigate}
          />
        )}

        <footer className="footer">
          <span>MedSupply Nexus</span>
          <span>Predict • Redistribute • Protect</span>
        </footer>
      </main>
    </div>
  );
}

/* =========================================================
   NAVIGATION
========================================================= */

function NavButton({
  icon,
  label,
  activePage,
  navigate,
}) {
  return (
    <button
      className={`nav-item ${
        activePage === label ? "active" : ""
      }`}
      onClick={() => navigate(label)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  risks,
  criticalRiskCount,
  activeTransferCount,
  transferStarted,
  navigate,
}) {
  const stats = [
    {
      label: "Critical Risks",
      value: criticalRiskCount,
      change: transferStarted
        ? "2 requiring attention"
        : "Requires attention",
      icon: AlertTriangle,
      tone: "danger",
    },
    {
      label: "Expiry Risks",
      value: "7",
      change: "Within 30 days",
      icon: Clock3,
      tone: "warning",
    },
    {
      label: "Active Transfers",
      value: activeTransferCount,
      change: transferStarted
        ? "Transfer currently moving"
        : "Currently moving",
      icon: Truck,
      tone: "info",
    },
    {
      label: "ColdChain Alerts",
      value: "2",
      change: "Needs monitoring",
      icon: Snowflake,
      tone: "cold",
    },
  ];

  return (
    <>
      <section className="welcome-row">
        <div>
          <h3>Good morning, Operations Team</h3>

          <p>
            Here's the current health of your medical supply
            network.
          </p>
        </div>

        <div className="live-indicator">
          <span></span>
          Live Network
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className={`stat-card ${stat.tone}`}
              key={stat.label}
            >
              <div className="stat-top">
                <div className="stat-icon">
                  <Icon size={19} />
                </div>

                <ChevronRight
                  size={17}
                  className="muted-icon"
                />
              </div>

              <div className="stat-value">
                {stat.value}
              </div>

              <div className="stat-label">
                {stat.label}
              </div>

              <div className="stat-change">
                {stat.change}
              </div>
            </div>
          );
        })}
      </section>

      <section className="content-grid">
        {/* =================================================
            RISKS
        ================================================= */}

        <div className="panel risk-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">
                SUPPLY MONITOR
              </p>

              <h3>Critical Supply Risks</h3>
            </div>

            {/* NOW WORKS */}

            <button
              className="text-button"
              onClick={() =>
                navigate("Supply Intelligence")
              }
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="risk-list">
            {risks.map((risk) => (
              <div
                className="risk-row"
                key={risk.id}
              >
                <div className="medicine-icon">
                  <Droplets size={19} />
                </div>

                <div className="risk-main">
                  <strong>{risk.medicine}</strong>
                  <span>{risk.hospital}</span>
                </div>

                <div className="risk-stock">
                  <strong>
                    {risk.stock} units
                  </strong>

                  <span>Current stock</span>
                </div>

                <div className="risk-days">
                  <strong>{risk.days}</strong>
                  <span>Coverage</span>
                </div>

                <div
                  className={`risk-status ${risk.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {risk.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            AI RECOMMENDATION
        ================================================= */}

        <div className="panel ai-panel">
          <div className="ai-heading">
            <div className="ai-icon">
              <Brain size={20} />
            </div>

            <div>
              <p className="panel-kicker">
                AI SUPPLY INTELLIGENCE
              </p>

              <h3>Recommended Action</h3>
            </div>
          </div>

          <div className="ai-alert">
            <div className="ai-alert-icon">
              {transferStarted ? (
                <CheckCircle2 size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
            </div>

            <div>
              <strong>
                {transferStarted
                  ? "Redistribution successfully initiated"
                  : "Redistribution opportunity detected"}
              </strong>

              <p>
                {transferStarted
                  ? "120 units of Amoxicillin are currently moving from CityCare Hospital to District Medical Centre."
                  : "District Medical Centre may run out of Amoxicillin in approximately 1.4 days."}
              </p>
            </div>
          </div>

          <div className="recommendation">
            <div className="recommendation-title">
              <TrendingUp size={17} />

              {transferStarted
                ? "Transfer in progress"
                : "Suggested intervention"}
            </div>

            <p>
              {transferStarted
                ? "The recommended 120-unit redistribution has been initiated and inventory has been updated."
                : "CityCare Hospital has sufficient surplus stock to cover the immediate demand."}
            </p>

            <div className="recommendation-route">
              <div>
                <span>FROM</span>
                <strong>CityCare Hospital</strong>
              </div>

              <ArrowRight size={18} />

              <div>
                <span>TO</span>
                <strong>
                  District Medical Centre
                </strong>
              </div>
            </div>

            {/* WORKING REVIEW TRANSFER */}

            <button
              className="primary-button"
              onClick={() =>
                navigate("Redistribution")
              }
            >
              {transferStarted
                ? "View Transfer"
                : "Review Transfer"}

              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   SUPPLY INTELLIGENCE
========================================================= */

function SupplyIntelligence({
  risks,
  transferStarted,
}) {
  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="panel-kicker">
            AI RISK ENGINE
          </p>

          <h3>Supply Intelligence</h3>

          <p>
            Predicting shortages before they become
            emergencies.
          </p>
        </div>

        <div className="live-indicator">
          <span></span>
          AI Monitoring
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="panel intelligence-main">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">
                FORECAST
              </p>

              <h3>Medicine Risk Analysis</h3>
            </div>
          </div>

          {risks.map((risk) => (
            <div
              className="intelligence-row"
              key={risk.id}
            >
              <div className="medicine-icon">
                <Droplets size={19} />
              </div>

              <div>
                <strong>{risk.medicine}</strong>
                <span>{risk.hospital}</span>
              </div>

              <div>
                <strong>
                  {risk.stock} units
                </strong>

                <span>Stock</span>
              </div>

              <div>
                <strong>{risk.days}</strong>
                <span>Coverage</span>
              </div>

              <div
                className={`risk-status ${risk.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {risk.status}
              </div>
            </div>
          ))}
        </div>

        <div className="panel forecast-card">
          <div className="ai-heading">
            <div className="ai-icon">
              <Brain size={20} />
            </div>

            <div>
              <p className="panel-kicker">
                AI FORECAST
              </p>

              <h3>Priority Action</h3>
            </div>
          </div>

          <div className="forecast-number">
            {transferStarted ? "Safe" : "34h"}
          </div>

          <p>
            {transferStarted
              ? "The Amoxicillin redistribution has been initiated. District Medical Centre now has 204 units."
              : "Estimated time until District Medical Centre reaches critical Amoxicillin stock."}
          </p>

          <div className="forecast-action">
            <ShieldCheck size={20} />

            <div>
              <strong>
                {transferStarted
                  ? "Transfer Active"
                  : "Recommended"}
              </strong>

              <span>
                {transferStarted
                  ? "120 units are currently in transit."
                  : "Transfer 120 units from CityCare Hospital."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REDISTRIBUTION
========================================================= */

function Redistribution({
  hospitals,
  transferStarted,
  initiateTransfer,
  activeTransferCount,
  resetDemo,
}) {
  const route = [
    hospitals[0].position,
    hospitals[2].position,
    hospitals[1].position,
  ];

  const cityCare = hospitals.find(
    (hospital) => hospital.id === "citycare"
  );

  const district = hospitals.find(
    (hospital) => hospital.id === "district"
  );

  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="panel-kicker">
            LIVE LOGISTICS NETWORK
          </p>

          <h3>Redistribution Network</h3>

          <p>
            Simulated real-world routing between hospitals with
            surplus and shortage.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div className="map-status">
            <span className="status-dot"></span>

            {activeTransferCount} Active Transfers
          </div>

          {/* =================================================
              DEMO RESET
          ================================================= */}

          <button
            className="secondary-button"
            onClick={resetDemo}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>
      </div>

      <div className="network-layout">
        {/* =================================================
            MAP
        ================================================= */}

        <div className="panel live-map-panel">
          <MapContainer
            center={[13.065, 80.245]}
            zoom={12}
            scrollWheelZoom={true}
            className="live-map"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polyline
              positions={route}
              pathOptions={{
                color: "#176b52",
                weight: 5,
                dashArray: "10 10",
              }}
            />

            {hospitals.map((hospital) => (
              <Marker
                key={hospital.id}
                position={hospital.position}
                icon={createHospitalIcon(
                  hospital.status
                )}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>
                      {hospital.name}
                    </strong>

                    <span>{hospital.status}</span>

                    <p>
                      {hospital.medicine}
                      <br />
                      {hospital.stock} units
                    </p>

                    <button>
                      View Hospital
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-legend">
            <span>
              <i className="legend-dot surplus"></i>
              Surplus
            </span>

            <span>
              <i className="legend-dot risk"></i>
              At Risk
            </span>

            <span>
              <i className="legend-dot critical"></i>
              Critical
            </span>
          </div>
        </div>

        {/* =================================================
            TRANSFER PANEL
        ================================================= */}

        <div className="panel transfer-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">
                AI MATCH
              </p>

              <h3>
                {transferStarted
                  ? "Transfer In Transit"
                  : "Recommended Transfer"}
              </h3>
            </div>

            <Sparkles size={20} />
          </div>

          <div className="transfer-alert">
            {transferStarted ? (
              <>
                <Truck size={20} />

                <div>
                  <strong>
                    Transfer currently in transit
                  </strong>

                  <p>
                    120 units of Amoxicillin are currently
                    moving from CityCare Hospital to
                    District Medical Centre.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle size={20} />

                <div>
                  <strong>
                    Shortage detected
                  </strong>

                  <p>
                    District Medical Centre has only
                    1.4 days of Amoxicillin coverage.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="transfer-box">
            <div>
              <span>FROM</span>

              <strong>CityCare Hospital</strong>

              <small>
                {cityCare.stock} units available
              </small>
            </div>

            <ArrowRight size={22} />

            <div>
              <span>TO</span>

              <strong>
                District Medical Centre
              </strong>

              <small>
                {district.stock} units remaining
              </small>
            </div>
          </div>

          <div className="transfer-details">
            <div>
              <span>MEDICINE</span>
              <strong>
                Amoxicillin 500mg
              </strong>
            </div>

            <div>
              <span>QUANTITY</span>
              <strong>120 units</strong>
            </div>

            <div>
              <span>EST. TRAVEL</span>
              <strong>42 minutes</strong>
            </div>

            <div>
              <span>ROUTE</span>
              <strong>18.4 km</strong>
            </div>
          </div>

          {/* =================================================
              ONE-TIME TRANSFER BUTTON
          ================================================= */}

          <button
            className="primary-button"
            onClick={initiateTransfer}
            disabled={transferStarted}
            style={{
              cursor: transferStarted
                ? "not-allowed"
                : "pointer",
              opacity: transferStarted ? 0.75 : 1,
            }}
          >
            <Truck size={17} />

            {transferStarted
              ? "Transfer In Transit"
              : "Initiate Transfer Simulation"}

            {transferStarted ? (
              <CheckCircle2
                size={18}
                style={{
                  marginLeft: "2px",
                }}
              />
            ) : (
              <ArrowRight size={17} />
            )}
          </button>

          {/* =================================================
              LIVE STATUS
          ================================================= */}

          {transferStarted && (
            <div
              className="transfer-live-status"
              style={{
                marginTop: "14px",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#eef8f3",
                color: "#176b52",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <Activity size={17} />

              <span>
                Live logistics update: shipment is currently
                moving.
              </span>
            </div>
          )}

          <p className="demo-note">
            Demo network — routing and inventory values are
            simulated for the hackathon prototype.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COLD CHAIN
========================================================= */

function ColdChain() {
  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="panel-kicker">
            TEMPERATURE INTELLIGENCE
          </p>

          <h3>ColdChain Sentinel</h3>

          <p>
            Monitoring temperature-sensitive medicines during
            transportation.
          </p>
        </div>

        <div className="safe-badge">
          ● Network Protected
        </div>
      </div>

      <div className="cold-summary-grid">
        <div className="panel cold-stat">
          <Snowflake size={25} />
          <strong>4</strong>
          <span>Active shipments</span>
        </div>

        <div className="panel cold-stat">
          <Thermometer size={25} />
          <strong>2</strong>
          <span>Temperature warnings</span>
        </div>

        <div className="panel cold-stat">
          <ShieldCheck size={25} />
          <strong>96.4%</strong>
          <span>Safe shipment rate</span>
        </div>
      </div>

      <div className="cold-shipment-grid">
        <ColdShipment
          id="MS-2048"
          medicine="MMR Vaccine"
          from="CityCare Hospital"
          to="District Medical Centre"
          temperature="4.8°C"
          status="SAFE"
        />

        <ColdShipment
          id="MS-2051"
          medicine="Insulin Glargine"
          from="Central Hospital"
          to="District Medical Centre"
          temperature="9.4°C"
          status="CRITICAL"
        />
      </div>
    </div>
  );
}

function ColdShipment({
  id,
  medicine,
  from,
  to,
  temperature,
  status,
}) {
  const critical = status === "CRITICAL";

  return (
    <div
      className={`panel shipment-card ${
        critical ? "critical-shipment" : ""
      }`}
    >
      <div className="shipment-top">
        <div>
          <p className="panel-kicker">
            SHIPMENT #{id}
          </p>

          <h3>{medicine}</h3>
        </div>

        <span
          className={
            critical
              ? "critical-badge"
              : "safe-badge"
          }
        >
          {critical
            ? "● TEMPERATURE EXCURSION"
            : "● SAFE"}
        </span>
      </div>

      <div className="temperature-display">
        <Thermometer size={30} />

        <div>
          <span>Current temperature</span>
          <strong>{temperature}</strong>
          <small>
            Safe range: 2°C — 8°C
          </small>
        </div>
      </div>

      <div className="shipment-route">
        <div>
          <span>FROM</span>
          <strong>{from}</strong>
        </div>

        <ArrowRight size={17} />

        <div>
          <span>TO</span>
          <strong>{to}</strong>
        </div>
      </div>

      {critical && (
        <div className="cold-warning">
          <AlertTriangle size={18} />

          <div>
            <strong>
              AI recommended action
            </strong>

            <p>
              Temperature exceeded safe range. Quarantine
              the affected batch and initiate a replacement
              shipment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   HOSPITAL NETWORK
========================================================= */

function HospitalNetwork({
  hospitals,
  navigate,
}) {
  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="panel-kicker">
            CONNECTED HEALTH FACILITIES
          </p>

          <h3>Hospital Network</h3>

          <p>
            Connected facilities participating in the supply
            network.
          </p>
        </div>
      </div>

      <div className="hospital-grid">
        {hospitals.map((hospital) => (
          <div
            className="panel hospital-card"
            key={hospital.id}
          >
            <div className="hospital-card-top">
              <div className="hospital-icon">
                <Hospital size={24} />
              </div>

              <span
                className={
                  hospital.status === "CRITICAL"
                    ? "critical-badge"
                    : hospital.status === "SURPLUS"
                      ? "surplus-badge"
                      : "warning-badge"
                }
              >
                ● {hospital.status}
              </span>
            </div>

            <h3>{hospital.name}</h3>

            <div className="hospital-info">
              <div>
                <MapPin size={16} />
                <span>
                  {hospital.address}
                </span>
              </div>

              <div>
                <Phone size={16} />
                <span>
                  {hospital.phone}
                </span>
              </div>

              <div>
                <Package size={16} />
                <span>
                  {hospital.medicine} —{" "}
                  {hospital.stock} units
                </span>
              </div>
            </div>

            {/* WORKING BUTTON */}

            <button
              className="secondary-button"
              onClick={() =>
                navigate("Supply Intelligence")
              }
            >
              View Inventory
              <ArrowRight size={16} />
            </button>

            <small className="demo-note">
              Contact details shown are demo data.
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   AI COPILOT
========================================================= */

function AICopilot({
  hospitals,
  risks,
  transferStarted,
  copilotAnswer,
  copilotQuestion,
  setCopilotQuestion,
  handleCopilotQuestion,
  handleCopilotSend,
  navigate,
}) {
  const district = hospitals.find(
    (hospital) => hospital.id === "district"
  );

  const amoxicillinRisk = risks.find(
    (risk) => risk.id === "amoxicillin"
  );

  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="panel-kicker">
            GENERATIVE AI
          </p>

          <h3>AI Supply Copilot</h3>

          <p>
            Ask the network intelligence system what action
            should happen next.
          </p>
        </div>
      </div>

      <div className="copilot-layout">
        {/* =================================================
            CHAT
        ================================================= */}

        <div className="panel copilot-chat">
          <div className="copilot-header">
            <div className="ai-icon">
              <Brain size={21} />
            </div>

            <div>
              <strong>MedSupply AI</strong>
              <span>
                Supply Intelligence Assistant
              </span>
            </div>
          </div>

          {/* =================================================
              AI RESPONSE
          ================================================= */}

          <div className="chat-message ai-message">
            <Sparkles size={18} />

            <div>
              <strong>
                AI Supply Copilot
              </strong>

              <p>{copilotAnswer}</p>
            </div>
          </div>

          {/* =================================================
              WORKING AI QUESTION BUTTONS
          ================================================= */}

          <div className="question-grid">
            <button
              onClick={() =>
                handleCopilotQuestion(
                  "Which medicine is at highest risk?"
                )
              }
            >
              Which medicine is at highest risk?
            </button>

            <button
              onClick={() =>
                handleCopilotQuestion(
                  "Where should we redistribute stock?"
                )
              }
            >
              Where should we redistribute stock?
            </button>

            <button
              onClick={() =>
                handleCopilotQuestion(
                  "Which shipment needs attention?"
                )
              }
            >
              Which shipment needs attention?
            </button>

            <button
              onClick={() =>
                handleCopilotQuestion(
                  "What action should we take first?"
                )
              }
            >
              What action should we take first?
            </button>
          </div>

          {/* =================================================
              WORKING AI INPUT
          ================================================= */}

          <div className="chat-input">
            <input
              value={copilotQuestion}
              onChange={(event) =>
                setCopilotQuestion(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCopilotSend();
                }
              }}
              placeholder="Ask about the medical supply network..."
            />

            <button
              onClick={handleCopilotSend}
              aria-label="Send AI question"
            >
              <Send size={17} />
            </button>
          </div>
        </div>

        {/* =================================================
            INSIGHTS
        ================================================= */}

        <div className="panel copilot-insights">
          <p className="panel-kicker">
            NETWORK INSIGHT
          </p>

          <h3>Priority Recommendation</h3>

          <div className="insight-score">
            <Activity size={20} />

            <strong>
              {transferStarted
                ? "Transfer In Transit"
                : "High Priority"}
            </strong>
          </div>

          <p>
            {transferStarted
              ? `District Medical Centre now has ${district.stock} units of Amoxicillin after the 120-unit redistribution was initiated.`
              : `District Medical Centre should receive Amoxicillin before its projected ${amoxicillinRisk.days} shortage threshold.`}
          </p>

          <div className="insight-step">
            <span>01</span>

            <strong>
              Identify surplus
            </strong>
          </div>

          <div className="insight-step">
            <span>02</span>

            <strong>
              {transferStarted
                ? "Transfer initiated"
                : "Plan redistribution"}
            </strong>
          </div>

          <div className="insight-step">
            <span>03</span>

            <strong>
              Monitor delivery
            </strong>
          </div>

          {/* =================================================
              WORKING AI ACTION
          ================================================= */}

          <button
            className="primary-button"
            onClick={() =>
              navigate("Redistribution")
            }
            style={{
              marginTop: "20px",
            }}
          >
            {transferStarted
              ? "View Transfer"
              : "Review Recommendation"}

            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;