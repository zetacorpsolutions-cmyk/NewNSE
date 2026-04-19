import { useState } from "react";

const ROOF_TYPES = ["RCC Flat", "Metal Sheet", "Mangalore Tile", "Asbestos", "Polycarbonate", "Ground Mount"];
const steps = ["Client Info", "System Design", "Extras", "Review & Quote"];

const formatINR = (n) => {
  if (!n && n !== 0) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
    <label style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#5a8f68" }}>{label}</label>
    {children}
  </div>
);

const inp = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 13px", color: "#e8f4e8", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" };

export default function SolarQuoteApp() {
  const [step, setStep] = useState(0);

  // Client
  const [client, setClient] = useState({ name: "", email: "", phone: "", address: "", state: "", roofType: "RCC Flat" });

  // System Design
  const [panel, setPanel] = useState({ brand: "", model: "", watt: "", qty: "" });
  const [inverter, setInverter] = useState({ brand: "", model: "", capacity: "", type: "" });
  const [battery, setBattery] = useState({ include: false, brand: "", model: "", capacity: "", qty: "" });
  const [structure, setStructure] = useState({ type: "", material: "" });
  const [acCable, setAcCable] = useState({ spec: "", length: "" });
  const [dcCable, setDcCable] = useState({ spec: "", length: "" });
  const [earthing, setEarthing] = useState({ spec: "", qty: "" });

  // Pricing — single total project cost
  const [projectCost, setProjectCost] = useState("");

  // Net Meter inclusions
  const [netMeterCostIncluded, setNetMeterCostIncluded] = useState(false);
  const [civilWorkIncluded, setCivilWorkIncluded] = useState(false);

  // Monitoring toggle
  const [monitoringIncluded, setMonitoringIncluded] = useState(false);

  // Warranty
  const [warranty, setWarranty] = useState({ panelYears: "", inverterYears: "", structureYears: "" });

  const [notes, setNotes] = useState("");
  const [quoteNumber] = useState("SQ-" + Math.floor(10000 + Math.random() * 90000));

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const num = (v) => parseFloat(v) || 0;

  // GST Calculation: 70% of project cost @ 5%, 30% @ 18% → effective ~8.9%
  const base = num(projectCost);
  const part70 = base * 0.70;
  const part30 = base * 0.30;
  const gst70 = part70 * 0.05;
  const gst30 = part30 * 0.18;
  const totalGst = gst70 + gst30;
  const grandTotal = base + totalGst;
  const effectiveGstPct = base > 0 ? ((totalGst / base) * 100).toFixed(2) : "8.90";

  const systemKw = panel.watt && panel.qty ? ((num(panel.watt) * num(panel.qty)) / 1000).toFixed(2) : "";

  const canProceed = () => step === 0 ? (client.name && client.phone && client.address) : true;

  const resetAll = () => {
    setStep(0);
    setClient({ name: "", email: "", phone: "", address: "", state: "", roofType: "RCC Flat" });
    setPanel({ brand: "", model: "", watt: "", qty: "" });
    setInverter({ brand: "", model: "", capacity: "", type: "" });
    setBattery({ include: false, brand: "", model: "", capacity: "", qty: "" });
    setStructure({ type: "", material: "" });
    setAcCable({ spec: "", length: "" }); setDcCable({ spec: "", length: "" });
    setEarthing({ spec: "", qty: "" });
    setProjectCost("");
    setNetMeterCostIncluded(false); setCivilWorkIncluded(false); setMonitoringIncluded(false);
    setWarranty({ panelYears: "", inverterYears: "", structureYears: "" });
    setNotes("");
  };

  const Toggle = ({ checked, onChange }) => (
    <label style={{ position: "relative", width: 42, height: 23, flexShrink: 0, display: "inline-block" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: "absolute", cursor: "pointer", inset: 0, background: checked ? "#3aaa4a" : "rgba(255,255,255,0.13)", borderRadius: 23, transition: "0.25s" }}>
        <span style={{ position: "absolute", height: 17, width: 17, left: checked ? 22 : 3, bottom: 3, background: "white", borderRadius: "50%", transition: "0.25s" }} />
      </span>
    </label>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0f1923 0%, #1a2d1a 50%, #0d2436 100%)", color: "#e8f4e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0f1923; } ::-webkit-scrollbar-thumb { background: #2d7a3a; border-radius: 3px; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
        .sc { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px; }
        .stitle { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #5fc86e; letter-spacing: 0.07em; text-transform: uppercase; display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .btn-primary { background: linear-gradient(135deg, #3aaa4a, #1e7a2e); color: #fff; border: none; border-radius: 10px; padding: 12px 28px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(58,170,74,0.4); }
        .btn-primary:disabled { opacity: 0.38; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-ghost { background: transparent; color: #8fc99a; border: 1px solid rgba(143,201,154,0.3); border-radius: 10px; padding: 12px 28px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-ghost:hover { border-color: #3aaa4a; color: #3aaa4a; }
        input[type=text], input[type=number], input[type=email], select, textarea { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 10px 13px; color: #e8f4e8; font-size: 14px; outline: none; transition: border-color 0.2s, background 0.2s; width: 100%; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); font-style: italic; font-size: 13px; }
        input:focus, select:focus, textarea:focus { border-color: #3aaa4a; background: rgba(58,170,74,0.07); }
        select option { background: #1a2d1a; color: #e8f4e8; }
        .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .sublabel { font-size: 11px; color: #4a7a56; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; margin: 8px 0; }
        .incl-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
        .incl-label { font-weight: 600; font-size: 14px; color: #c8e4cc; }
        .incl-sub { font-size: 12px; color: #4a7a56; margin-top: 2px; }
        .badge-yes { background: rgba(58,170,74,0.18); color: #5fc86e; border: 1px solid rgba(58,170,74,0.35); padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .badge-no { background: rgba(255,255,255,0.06); color: #5a8f68; border: 1px solid rgba(255,255,255,0.1); padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .step-dot { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all 0.3s; flex-shrink: 0; }
        .qrow { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13.5px; gap: 12px; }
        .qrow span:first-child { color: #b8d8be; flex: 1; }
        .qrow span:last-child { color: #e8f4e8; font-weight: 600; white-space: nowrap; }
        @media (max-width: 580px) { .g2, .g3 { grid-template-columns: 1fr; } }
        @media print {
          body * { visibility: hidden; }
          .print-zone, .print-zone * { visibility: visible; }
          .print-zone { position: fixed; inset: 0; overflow: auto; background: white; color: #111; padding: 30px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "26px 24px 0" }} className="no-print">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: "linear-gradient(135deg,#3aaa4a,#1e7a2e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>☀️</div>
          <div>
            <div style={{ fontFamily: "Syne", fontSize: 21, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>SolarQuote Pro</div>
            <div style={{ fontSize: 12, color: "#4a7a56" }}>Solar Installation Quotation · India</div>
          </div>
        </div>

        {/* Step Bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div className="step-dot" style={{ background: i < step ? "#3aaa4a" : i === step ? "linear-gradient(135deg,#3aaa4a,#1e7a2e)" : "rgba(255,255,255,0.07)", color: i <= step ? "#fff" : "#3d6648", border: i === step ? "2px solid #5fc86e" : "none", boxShadow: i === step ? "0 0 14px rgba(58,170,74,0.45)" : "none" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: i === step ? "#5fc86e" : "#3d6648", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? "#3aaa4a" : "rgba(255,255,255,0.07)", margin: "0 6px", marginBottom: 20 }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 60px" }}>

        {/* ── STEP 0: Client Info ── */}
        {step === 0 && (
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Client Information</div>
            <div style={{ fontSize: 13, color: "#4a7a56", marginBottom: 22 }}>Enter customer details for this solar quotation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="g2">
                <Field label="Customer Name *"><input type="text" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} placeholder="e.g. Ramesh Kumar" /></Field>
                <Field label="Mobile Number *"><input type="text" value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} placeholder="98XXXXXXXX" /></Field>
              </div>
              <Field label="Email Address"><input type="email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} placeholder="customer@email.com" /></Field>
              <Field label="Installation Address *"><input type="text" value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} placeholder="Plot No., Street, City, PIN Code" /></Field>
              <div className="g2">
                <Field label="State">
                  <select value={client.state} onChange={e => setClient({ ...client, state: e.target.value })}>
                    <option value="">Select State</option>
                    {["Andhra Pradesh","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Roof Type">
                  <select value={client.roofType} onChange={e => setClient({ ...client, roofType: e.target.value })}>
                    {ROOF_TYPES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: System Design ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: "#fff" }}>System Design</div>
              <div style={{ fontSize: 13, color: "#4a7a56", marginTop: 4 }}>Fill in specifications. No pricing needed here — enter total project cost in the next step.</div>
            </div>

            {/* Solar Panels */}
            <div className="sc">
              <div className="stitle">🔆 Solar Panels</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="g3">
                  <Field label="Brand / Make"><input type="text" value={panel.brand} onChange={e => setPanel({ ...panel, brand: e.target.value })} placeholder="e.g. Adani, Vikram" /></Field>
                  <Field label="Model / Series"><input type="text" value={panel.model} onChange={e => setPanel({ ...panel, model: e.target.value })} placeholder="e.g. Mono PERC" /></Field>
                  <Field label="Watt Peak (Wp)"><input type="number" value={panel.watt} onChange={e => setPanel({ ...panel, watt: e.target.value })} placeholder="e.g. 540" /></Field>
                </div>
                <div className="g3">
                  <Field label="Quantity (Nos.)"><input type="number" value={panel.qty} onChange={e => setPanel({ ...panel, qty: e.target.value })} placeholder="e.g. 10" /></Field>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#5a8f68" }}>System Size (Auto)</label>
                    <div style={{ background: "rgba(58,170,74,0.09)", border: "1px solid rgba(58,170,74,0.25)", borderRadius: 9, padding: "10px 13px", color: systemKw ? "#5fc86e" : "#3d6648", fontWeight: 700, fontSize: 15 }}>{systemKw ? `${systemKw} kWp` : "—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inverter */}
            <div className="sc">
              <div className="stitle">⚡ Inverter</div>
              <div className="g3">
                <Field label="Brand / Make"><input type="text" value={inverter.brand} onChange={e => setInverter({ ...inverter, brand: e.target.value })} placeholder="e.g. Solis, Growatt" /></Field>
                <Field label="Model"><input type="text" value={inverter.model} onChange={e => setInverter({ ...inverter, model: e.target.value })} placeholder="e.g. S6-GR1P5K" /></Field>
                <Field label="Capacity (kW)"><input type="text" value={inverter.capacity} onChange={e => setInverter({ ...inverter, capacity: e.target.value })} placeholder="e.g. 5kW" /></Field>
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label="Type">
                  <select value={inverter.type} onChange={e => setInverter({ ...inverter, type: e.target.value })}>
                    <option value="">Select Type</option>
                    {["On-Grid", "Off-Grid", "Hybrid", "String", "Micro"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Battery */}
            <div className="sc">
              <div className="stitle">
                <span>🔋 Battery Storage</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#4a7a56", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>Include</span>
                  <Toggle checked={battery.include} onChange={e => setBattery({ ...battery, include: e.target.checked })} />
                </div>
              </div>
              {battery.include ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="g3">
                    <Field label="Brand"><input type="text" value={battery.brand} onChange={e => setBattery({ ...battery, brand: e.target.value })} placeholder="e.g. Exide, Luminous" /></Field>
                    <Field label="Model / Type"><input type="text" value={battery.model} onChange={e => setBattery({ ...battery, model: e.target.value })} placeholder="e.g. LiFePO4" /></Field>
                    <Field label="Capacity (kWh / Ah)"><input type="text" value={battery.capacity} onChange={e => setBattery({ ...battery, capacity: e.target.value })} placeholder="e.g. 10kWh" /></Field>
                  </div>
                  <div className="g2">
                    <Field label="Quantity (Nos.)"><input type="number" value={battery.qty} onChange={e => setBattery({ ...battery, qty: e.target.value })} placeholder="e.g. 2" /></Field>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#3d6648", fontSize: 13, fontStyle: "italic" }}>Toggle on to add battery storage</div>
              )}
            </div>

            {/* Structure */}
            <div className="sc">
              <div className="stitle">🏗️ Mounting Structure</div>
              <div className="g2">
                <Field label="Structure Type"><input type="text" value={structure.type} onChange={e => setStructure({ ...structure, type: e.target.value })} placeholder="e.g. Fixed Tilt, Flush" /></Field>
                <Field label="Material"><input type="text" value={structure.material} onChange={e => setStructure({ ...structure, material: e.target.value })} placeholder="e.g. GI, Aluminium" /></Field>
              </div>
            </div>

            {/* Cables & Earthing */}
            <div className="sc">
              <div className="stitle">🔌 Cables & Earthing</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="sublabel">AC Cable</div>
                <div className="g2">
                  <Field label="Specification"><input type="text" value={acCable.spec} onChange={e => setAcCable({ ...acCable, spec: e.target.value })} placeholder="e.g. 4 Sqmm Armoured" /></Field>
                  <Field label="Length (Metres)"><input type="number" value={acCable.length} onChange={e => setAcCable({ ...acCable, length: e.target.value })} placeholder="e.g. 30" /></Field>
                </div>
                <div className="sublabel">DC Cable</div>
                <div className="g2">
                  <Field label="Specification"><input type="text" value={dcCable.spec} onChange={e => setDcCable({ ...dcCable, spec: e
