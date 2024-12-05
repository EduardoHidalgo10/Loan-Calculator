import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [annualInterestRate, setAnnualInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const formatNumber = (value) => {
    if (!value || isNaN(value)) return "";
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const unformatNumber = (value) => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleInputChange = (setter, field) => (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setter(rawValue);
    setErrors((prev) => ({ ...prev, [field]: false })); // Limpia el error para el campo
  };

  const validateFields = () => {
    const newErrors = {};
    if (!loanAmount) newErrors.loanAmount = "El monto del préstamo es obligatorio.";
    if (!annualInterestRate) newErrors.annualInterestRate = "La tasa de interés es obligatoria.";
    if (!loanTerm) newErrors.loanTerm = "El plazo del préstamo es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePayment = () => {
    if (!validateFields()) return;

    setLoading(true);
    setTimeout(() => {
      const principal = parseFloat(unformatNumber(loanAmount));
      const interestRate = parseFloat(unformatNumber(annualInterestRate)) / 100 / 12;
      const totalPayments = parseInt(unformatNumber(loanTerm));

      if (principal && interestRate && totalPayments) {
        const payment =
          (principal * interestRate) /
          (1 - Math.pow(1 + interestRate, -totalPayments));
        setMonthlyPayment(payment);
      } else {
        setMonthlyPayment(0);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="app-container">
      <h1>Calcule su Préstamo</h1>
      <div className="calculator">
        <label>
          <b>Monto del Préstamo:</b>
          <input
            type="text"
            value={loanAmount ? formatNumber(loanAmount) : ""}
            onChange={handleInputChange(setLoanAmount, "loanAmount")}
            placeholder="Ej. RD$50,000"
            className={errors.loanAmount ? "input-error" : ""}
          />
          {errors.loanAmount && (
            <p className="error-message">{errors.loanAmount}</p>
          )}
        </label>
        <label>
          <b>Tasa de Interés Anual (%):</b>
          <input
            type="text"
            value={annualInterestRate}
            onChange={handleInputChange(
              setAnnualInterestRate,
              "annualInterestRate"
            )}
            placeholder="Ej. 5"
            className={errors.annualInterestRate ? "input-error" : ""}
          />
          {errors.annualInterestRate && (
            <p className="error-message">{errors.annualInterestRate}</p>
          )}
        </label>
        <label>
          <b>Plazo del Préstamo (meses):</b>
          <input
            type="text"
            value={loanTerm}
            onChange={handleInputChange(setLoanTerm, "loanTerm")}
            placeholder="Ej. 24"
            className={errors.loanTerm ? "input-error" : ""}
          />
          {errors.loanTerm && (
            <p className="error-message">{errors.loanTerm}</p>
          )}
        </label>
        <button onClick={calculatePayment} disabled={loading}>
          {loading ? <span className="spinner"></span> : "Calcular"}
        </button>
        <h2>
          <b>Pago Mensual:</b>{" "}
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <span>
              {monthlyPayment ? formatNumber(monthlyPayment) : "RD$0"}
            </span>
          )}
        </h2>
      </div>
    </div>
  );
};

export default App;
