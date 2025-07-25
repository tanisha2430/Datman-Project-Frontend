// import React, { useState } from "react";
// import LottieLoader from "./LottieLoader";

// type Payload = {
//   id: number;
//   total_sales_count: number;
//   total_sales_amount: number;
//   refund_count: number;
//   chargeback_count: number;
//   refund_amount: number;
//   chargeback_amount: number;
//   successful_sales_count: number;
//   fraud_score: number;
//   some_other_feature: number;
//   yet_another_feature: number;
// };

// const defaultPayload: Payload = {
//   id: 1,
//   total_sales_count: 100,
//   total_sales_amount: 10000,
//   refund_count: 2,
//   chargeback_count: 1,
//   refund_amount: 300,
//   chargeback_amount: 150,
//   successful_sales_count: 97,
//   fraud_score: 50,
//   some_other_feature: 0,
//   yet_another_feature: 0,
// };

// const Kdfs: React.FC = () => {
//   const [payloadText, setPayloadText] = useState(
//     JSON.stringify(defaultPayload, null, 2)
//   );
//   const [step, setStep] = useState(0);
//   const [layer1Status, setLayer1Status] = useState<string | null>(null);
//   const [layer1Flags, setLayer1Flags] = useState<string[]>([]);
//   const [layer2Status, setLayer2Status] = useState<string | null>(null);
//   const [finalStatus, setFinalStatus] = useState<string | null>(null);
//   // const [error, setError] = useState<string | null>(null);

//   const simulateScoring = () => {
//     try {
//       const data: Payload = JSON.parse(payloadText);
//       setStep(1);
//       setLayer1Status(layer1Flags.toString());

//       setTimeout(() => {
//         const flags = [];
//         if (data.refund_count > 0) flags.push("avs_mismatch");
//         if (data.chargeback_count > 0) flags.push("cvv_mismatch");
//         setLayer1Status(flags.length ? "Flagged" : "Clean");
//         setLayer1Flags(flags);
//         setStep(2);
//       }, 3000);

//       setTimeout(() => {
//         const refundRate = data.refund_count / data.total_sales_count || 0;
//         const chargebackRate =
//           data.chargeback_count / data.total_sales_count || 0;
//         const refundAmtRate = data.refund_amount / data.total_sales_amount || 0;
//         const chargebackAmtRate =
//           data.chargeback_amount / data.total_sales_amount || 0;
//         let score = data.fraud_score || 50;
//         score -= refundRate * 5;
//         score -= refundAmtRate * 5;
//         score -= chargebackRate * 20;
//         score -= chargebackAmtRate * 30;
//         if (refundRate < 0.1 && chargebackRate < 0.02) {
//           score += data.successful_sales_count * 0.75;
//           score += Math.min(data.total_sales_amount, 10000) * 0.001;
//         }
//         score = Math.max(0, Math.min(score, 100));
//         setLayer2Status(score.toFixed(2));
//         setStep(3);
//       }, 6000);

//       setTimeout(() => {
//         const pred = layer2Status && parseFloat(layer2Status) < 40 ? 0 : 1;
//         setFinalStatus(pred !== 0 ? "ACCEPTED" : "DECLINED");
//         setStep(4);
//       }, 9000);

//       // setError(null);
//     } catch {
//       // setError("Invalid JSON input.");
//     }
//   };

//   const renderBox = (title: string, content: React.ReactNode, idx: number) => (
//     <div className="flex flex-col items-center w-64 bg-white rounded-xl p-4 shadow">
//       <h3 className="text-sm font-semibold mb-2">{title}</h3>
//       <div className="h-32 flex items-center justify-center">
//         {step <= idx ? (
//           <LottieLoader layer={(idx + 1) as 1 | 2 | 3} />
//         ) : (
//           content
//         )}
//       </div>
//     </div>
//   );

//   const Arrow = () => <div className="text-gray-400 text-2xl px-2">→</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-8">
//         Fraud Scoring Simulator
//       </h1>

//       <div className="bg-blue-50 max-w-4xl mx-auto rounded-lg p-6 shadow">
//         <textarea
//           value={payloadText}
//           onChange={(e) => setPayloadText(e.target.value)}
//           rows={14}
//           className="w-full mb-4 font-mono text-sm border p-3 rounded"
//         />
//         <button
//           onClick={simulateScoring}
//           className="bg-blue-600 text-white px-6 py-2 rounded"
//         >
//           Send for Scoring
//         </button>
//       </div>

//       <div className="mt-10 flex justify-center items-center space-x-4">
//         {renderBox(
//           "Layer 1 (Rule-Based)",
//           <>
//             <div className="font-medium">{layer1Status}</div>
//             <ul className="text-xs text-red-600">
//               {layer1Flags.map((f, i) => (
//                 <li key={i}>{f}</li>
//               ))}
//             </ul>
//           </>,
//           1
//         )}
//         <Arrow />
//         {renderBox("Layer 2 (ML Model)", <div>Score: {layer2Status}</div>, 2)}
//         <Arrow />
//         {renderBox("Final Decision", <div>{finalStatus}</div>, 3)}
//       </div>
//     </div>
//   );
// };

// export default Kdfs;





























"use client";
import React, { useState } from "react";

type Payload = {
  bin: string;
  last_4: string;
  name: string;
  email: string;
  ip_address: string;
  order_id: string;
  shopper_id: string;
  merchant_id: string;
  country_code: string;
  currency: string;
  sale: number;
  sale_amount: number;
  refund: number;
  refund_amount: number;
  chargeback: number;
  chargeback_amount: number;
  billing_address: string;
  shipping_address: string;
  browser_info: string;
  avs_check: boolean;
  cvv_matched: boolean;
  is_3ds_required: boolean;
};

const defaultPayload: Payload = {
  bin: "123456",
  last_4: "7890",
  name: "Test User",
  email: "test@example.com",
  ip_address: "127.0.0.1",
  order_id: "ORD001",
  shopper_id: "SHOP001",
  merchant_id: "MERCH001",
  country_code: "gb",
  currency: "gbp",
  sale: 1,
  sale_amount: 1000,
  refund: 0,
  refund_amount: 0,
  chargeback: 0,
  chargeback_amount: 0,
  billing_address: "123 Street",
  shipping_address: "123 Street",
  browser_info: "Chrome/117",
  avs_check: true,
  cvv_matched: false,
  is_3ds_required: false,
};

export default function Kdfs() {
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(defaultPayload, null, 2)
  );
  const [step, setStep] = useState(0);

  const [flagDecision, setFlagDecision] = useState<string | null>(null);
  const [triggeredFlags, setTriggeredFlags] = useState<string[] | null>(null);
  const [formulaDecision, setFormulaDecision] = useState<string | null>(null);
  const [formulaScore, setFormulaScore] = useState<number | null>(null);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateScoring = async () => {
    try {
      const data: Payload = JSON.parse(payloadText);
      console.log("📤 Sending to backend:", data);
      setStep(1);

      const response = await fetch(
        "https://loving-peace-production.up.railway.app/train",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("📥 Received from backend:", result);

      if (!response.ok) throw new Error(result?.error || "Unknown error");

      const ruleResult = result.layer1result || {};
      console.log("- Layer 1 Result:", ruleResult);

      const { flags, flag_result, score, status_score } = ruleResult;

      const { bin, last_4 } = result;

      setFlagDecision(flag_result || null);
      setTriggeredFlags(flags || []);
      setFormulaDecision(status_score ?? null);
      setFormulaScore(score ?? null);

      console.log("flagDecision", flagDecision);
      console.log("triggeredFlags", triggeredFlags);
      console.log("formulaDecision", formulaDecision);
      console.log("formulaDecision", formulaScore);
      console.log("bin", bin);
      console.log("last_4", last_4);

      setFinalStatus(
        flag_result === "a"
          ? "ACCEPTED"
          : flag_result === "r"
          ? "REVIEW"
          : flag_result === "d"
          ? "DECLINE"
          : null
      );

      setError(null);
      setStep(4);

      const refreshResponse = await fetch(
        "https://loving-peace-production.up.railway.app/refresh-score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bin, last_4 }),
        }
      );

      const refreshResult = await refreshResponse.json();
      console.log("refreshResult", refreshResult);
      if (!refreshResponse.ok)
        throw new Error(refreshResult?.error || "Failed to fetch AI result");
      const updates = refreshResult?.updates || [];
      const statusFromAi = updates[0]?.layer2_status || null;
      setAiPrediction(statusFromAi);
      setStep(5);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Invalid JSON");
    }
  };

  const getFullForm = (text: string | null): string => {
    switch (text?.toLowerCase()) {
      case "a":
        return "ACCEPTED";
      case "r":
        return "REVIEW";
      case "d":
        return "DECLINE";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-black";
    if (score < 40) return "bg-red-100 text-red-700";
    if (score <= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-black";
    if (status === "a") return "bg-green-100 text-green-700";
    if (status === "r") return "bg-yellow-100 text-yellow-700";
    if (status === "d") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-black";
  };

  const getFlagBoxColor = () => {
    if (triggeredFlags === null) return "bg-gray-100 text-black";
    return triggeredFlags.length > 0
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">KDFS Fraud Engine</h1>
      </div>

      <div className="grid grid-cols-2 gap-12 w-full max-w-5xl mt-8">
        <div className="col-span-1">
          <label className="text-xl font-semibold">Transaction Payload</label>
          <textarea
            rows={20}
            className="w-full mt-2 border border-gray-300 rounded-md p-2 text-black"
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
          ></textarea>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={simulateScoring}
          >
            Simulate Score
          </button>
          {error && (
            <div className="text-red-500 font-medium text-center mt-4">
              {error}
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    step >= s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 5 && <div className="flex-1 border-t-2" />}
              </React.Fragment>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Step 1: Flags Triggered</h2>
            <div className={`p-4 border rounded ${getFlagBoxColor()}`}>
              {triggeredFlags === null
                ? "..."
                : triggeredFlags.length
                ? triggeredFlags.join(", ")
                : "No flag triggered"}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Step 2: Flag Status</h2>
            <div
              className={`p-4 border rounded ${getStatusColor(flagDecision)}`}
            >
              {finalStatus !== null ? getFullForm(flagDecision) : "null"}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Step 3: Formula Score</h2>
            <div
              className={`p-4 border rounded ${getScoreColor(formulaScore)}`}
            >
              {formulaScore !== null ? formulaScore.toFixed(2) : "null"}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Step 4: Formula Status</h2>
            <div
              className={`p-4 border rounded ${getStatusColor(
                formulaDecision
              )}`}
            >
              {formulaDecision !== null ? getFullForm(formulaDecision) : "null"}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Step 5: AI/ML Prediction</h2>
            <div
              className={`p-4 border rounded ${getStatusColor(aiPrediction)}`}
            >
              {aiPrediction !== null ? getFullForm(aiPrediction) : "null"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


