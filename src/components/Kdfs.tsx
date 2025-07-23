import React, { useState } from "react";
import LottieLoader from "./LottieLoader";

type Payload = {
  id: number;
  total_sales_count: number;
  total_sales_amount: number;
  refund_count: number;
  chargeback_count: number;
  refund_amount: number;
  chargeback_amount: number;
  successful_sales_count: number;
  fraud_score: number;
  some_other_feature: number;
  yet_another_feature: number;
};

const defaultPayload: Payload = {
  id: 1,
  total_sales_count: 100,
  total_sales_amount: 10000,
  refund_count: 2,
  chargeback_count: 1,
  refund_amount: 300,
  chargeback_amount: 150,
  successful_sales_count: 97,
  fraud_score: 50,
  some_other_feature: 0,
  yet_another_feature: 0,
};

const Kdfs: React.FC = () => {
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(defaultPayload, null, 2)
  );
  const [step, setStep] = useState(0);
  const [layer1Status, setLayer1Status] = useState<string | null>(null);
  const [layer1Flags, setLayer1Flags] = useState<string[]>([]);
  const [layer2Status, setLayer2Status] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const simulateScoring = () => {
    try {
      const data: Payload = JSON.parse(payloadText);
      setStep(1);
      setLayer1Status(layer1Flags.toString());

      setTimeout(() => {
        const flags = [];
        if (data.refund_count > 0) flags.push("avs_mismatch");
        if (data.chargeback_count > 0) flags.push("cvv_mismatch");
        setLayer1Status(flags.length ? "Flagged" : "Clean");
        setLayer1Flags(flags);
        setStep(2);
      }, 3000);

      setTimeout(() => {
        const refundRate = data.refund_count / data.total_sales_count || 0;
        const chargebackRate =
          data.chargeback_count / data.total_sales_count || 0;
        const refundAmtRate = data.refund_amount / data.total_sales_amount || 0;
        const chargebackAmtRate =
          data.chargeback_amount / data.total_sales_amount || 0;
        let score = data.fraud_score || 50;
        score -= refundRate * 5;
        score -= refundAmtRate * 5;
        score -= chargebackRate * 20;
        score -= chargebackAmtRate * 30;
        if (refundRate < 0.1 && chargebackRate < 0.02) {
          score += data.successful_sales_count * 0.75;
          score += Math.min(data.total_sales_amount, 10000) * 0.001;
        }
        score = Math.max(0, Math.min(score, 100));
        setLayer2Status(score.toFixed(2));
        setStep(3);
      }, 6000);

      setTimeout(() => {
        const pred = layer2Status && parseFloat(layer2Status) < 40 ? 0 : 1;
        setFinalStatus(pred !== 0 ? "ACCEPTED" : "DECLINED");
        setStep(4);
      }, 9000);

      // setError(null);
    } catch {
      // setError("Invalid JSON input.");
    }
  };

  const renderBox = (title: string, content: React.ReactNode, idx: number) => (
    <div className="flex flex-col items-center w-64 bg-white rounded-xl p-4 shadow">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="h-32 flex items-center justify-center">
        {step <= idx ? (
          <LottieLoader layer={(idx + 1) as 1 | 2 | 3} />
        ) : (
          content
        )}
      </div>
    </div>
  );

  const Arrow = () => <div className="text-gray-400 text-2xl px-2">→</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Fraud Scoring Simulator
      </h1>

      <div className="bg-blue-50 max-w-4xl mx-auto rounded-lg p-6 shadow">
        <textarea
          value={payloadText}
          onChange={(e) => setPayloadText(e.target.value)}
          rows={14}
          className="w-full mb-4 font-mono text-sm border p-3 rounded"
        />
        <button
          onClick={simulateScoring}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Send for Scoring
        </button>
      </div>

      <div className="mt-10 flex justify-center items-center space-x-4">
        {renderBox(
          "Layer 1 (Rule-Based)",
          <>
            <div className="font-medium">{layer1Status}</div>
            <ul className="text-xs text-red-600">
              {layer1Flags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </>,
          1
        )}
        <Arrow />
        {renderBox("Layer 2 (ML Model)", <div>Score: {layer2Status}</div>, 2)}
        <Arrow />
        {renderBox("Final Decision", <div>{finalStatus}</div>, 3)}
      </div>
    </div>
  );
};

export default Kdfs;
