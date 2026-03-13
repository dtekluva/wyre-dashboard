import { useState } from "react";
import { isReportReadyToSend } from "../helpers/v2/organizationDataHelpers";
import { sendingReport } from "../report/reportApi";

const SendReportPanel = ({ reportContext }) => {
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);

  const isReady = isReportReadyToSend(reportContext);

  const handleSend = async () => {
    if (!isReady || !recipient) return;

    setLoading(true);
    try {
      await sendingReport({
        ...reportContext,
        recipient,
      });
      alert("Report sent successfully");
      setRecipient("");
    } catch (err) {
      console.error(err);
      alert("Failed to send report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-card">
      <h4>Send Report</h4>

      <input
        type="email"
        placeholder="Recipient email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <button
        disabled={!isReady || !recipient || loading}
        onClick={handleSend}
      >
        {loading ? "Sending…" : "Send Report"}
      </button>

      {!isReady && (
        <p className="hint">
          Select required parameters to enable sending
        </p>
      )}
    </div>
  );
};

export default SendReportPanel;