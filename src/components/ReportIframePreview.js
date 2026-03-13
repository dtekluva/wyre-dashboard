// components/ReportIframePreview.jsx
// import { useEffect, useState } from "react";
// import { fetchReportPreview } from "../report/reportApi";

// export default function ReportIframePreview({
//   reportType,
//   branchId,
//   params
// }) {
//   const [html, setHtml] = useState("");
//   const [loading, setLoading] = useState(false);
//   console.log('branch-id === ', branchId);
//   console.log('params === ', params);
//   console.log('report-type === ', reportType);
  

//   useEffect(() => {
//     if (!branchId || !reportType) return;

//     setLoading(true);
//     fetchReportPreview({
//       reportType,
//       branchId,
//       ...params
//     })
//       .then(setHtml)
//       .finally(() => setLoading(false));
//   }, [reportType, branchId, params]);

//   if (loading) {
//     return <div className="p-6 text-gray-500">Loading preview…</div>;
//   }

//   if (!html) {
//     return <div className="p-6 text-gray-400">No preview available</div>;
//   }

//   return (
//     <iframe
//       title="Report Preview"
//       srcDoc={html}
//       sandbox="allow-same-origin"
//       style={{
//         width: "100%",
//         minHeight: "900px",
//         border: "none",
//         background: "white"
//       }}
//     />
//   );
// }


import { useEffect, useState } from "react";
import { previewReport } from "../report/reportApi";

const ReportIframePreview = ({ reportContext }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!reportContext.branch_id) return;

  //   setLoading(true);

  //   previewReport(reportContext)
  //     .then((res) => setHtml(res.data.html_email))
  //     .catch(() => setHtml(""))
  //     .finally(() => setLoading(false));
  // }, [reportContext]);

  useEffect(() => {
  if (!reportContext) return; // ⬅ CRITICAL

  setLoading(true);

  previewReport(reportContext)
    .then((res) => setHtml(res.data.html_email))
    .catch(() => setHtml(""))
    .finally(() => setLoading(false));
}, [reportContext]);

  if (loading) return <p>Loading preview…</p>;
  if (!html) return <p>No preview available</p>;

  return (
    <iframe
      title="Report Preview"
      style={{ width: "100%", height: "80vh", border: "none" }}
      srcDoc={html}
    />
  );
};

export default ReportIframePreview;