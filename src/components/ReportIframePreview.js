import { useEffect, useState } from "react";
import { previewReport } from "../report/reportApi";

const normText = (s) => (s || "").replace(/\s+/g, " ").trim();

/** Promo block mentions dashboard access; exclude nodes that also carry the email sign-off. */
function isDashboardAccessCalloutText(text) {
  const t = normText(text);
  if (!/dashboard access/i.test(t)) return false;
  if (/regards,?\s*wyre/i.test(t)) return false;
  return (
    /for full details|visit your dashboard|view\s+dashboard/i.test(t) ||
    t.length < 800
  );
}

/**
 * Preview HTML from the API includes a "Dashboard Access" callout and CTA.
 * Strip the whole section for a cleaner on-page preview; emailed reports are unchanged.
 */
function stripDashboardAccessSectionFromPreviewHtml(html) {
  if (!html || typeof html !== "string") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;
    if (!body) return html;

    // 1) Nested tables used as the callout card (prefer smallest match = inner promo table)
    const tableHits = [...body.querySelectorAll("table")]
      .map((el) => ({ el, t: normText(el.textContent) }))
      .filter(({ t }) => isDashboardAccessCalloutText(t) && t.length <= 4000)
      .sort((a, b) => a.t.length - b.t.length);
    tableHits.forEach(({ el }) => el.remove());

    // 2) Div-based callouts (deepest nodes first)
    [...body.querySelectorAll("div")]
      .reverse()
      .forEach((div) => {
        const t = normText(div.textContent);
        if (!isDashboardAccessCalloutText(t) || t.length > 4000) return;
        div.remove();
      });

    // 3) Promo split across consecutive <tr> rows in the main layout
    const rows = [...body.querySelectorAll("tr")];
    for (const tr of rows) {
      if (!tr.isConnected) continue;
      const t = normText(tr.textContent);
      if (/regards/i.test(t)) continue;
      if (!/dashboard access/i.test(t)) continue;
      if (/for full details|visit your dashboard|view\s+dashboard/i.test(t)) {
        tr.remove();
        continue;
      }
      let n = tr.nextElementSibling;
      const chunk = [tr];
      while (n && n.tagName === "TR" && chunk.length < 12) {
        const nt = normText(n.textContent);
        if (/regards/i.test(nt)) break;
        if (
          nt.length > 250 &&
          !/dashboard access|for full details|visit your dashboard|view\s+dashboard/i.test(
            nt
          )
        ) {
          break;
        }
        chunk.push(n);
        if (/for full details|visit your dashboard|view\s+dashboard/i.test(nt)) {
          chunk.forEach((row) => row.remove());
          break;
        }
        n = n.nextElementSibling;
      }
    }

    // 4) Any remaining "View Dashboard" controls
    const ctas = [
      ...body.querySelectorAll(
        "a, button, [role='button'], input[type='submit'], input[type='button']"
      ),
    ].filter((el) =>
      /view\s+dashboard/i.test(normText(el.textContent))
    );
    for (const el of ctas) {
      const row = el.closest("tr");
      if (row) {
        const prev = row.previousElementSibling;
        row.remove();
        if (
          prev &&
          prev.tagName === "TR" &&
          /dashboard access/i.test(prev.textContent || "")
        ) {
          prev.remove();
        }
      } else {
        el.remove();
      }
    }

    return doc.documentElement.outerHTML;
  } catch {
    return html;
  }
}

const ReportIframePreview = ({ reportContext }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!reportContext) return; // ⬅ CRITICAL

  setLoading(true);

  previewReport(reportContext)
    .then((res) =>
      setHtml(stripDashboardAccessSectionFromPreviewHtml(res.data.html_email))
    )
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