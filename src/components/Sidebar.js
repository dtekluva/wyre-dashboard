import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { connect, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import CompleteDataContext from "../Context"
import LatestLogo from "../icons/LatestLogo"
import { fetchSideBar } from "../redux/actions/sidebar/sidebar.action"
import SidebarOrganization from "./SidebarOrganization"
import { Button, Input, List, Popover } from "antd"
import { SwapOutlined, SearchOutlined } from "@ant-design/icons"
import BranchSwitcher from "./BranchSwitcher"

type Branch = { id: string; name: string }

const BRANCHES: Branch[] = [
  { id: "1", name: "Polaris Agodi" },
  { id: "2", name: "Polaris Marina" },
  { id: "3", name: "Polaris Ikoyi" },
  { id: "4", name: "Polaris Abuja" },
  { id: "5", name: "Polaris Yaba" },
  { id: "6", name: "Polaris Lekki" },
  { id: "7", name: "Polaris VI" },
]

function Sidebar({ fetchSideBar: fetchSideBarData }: { fetchSideBar: () => void }) {
  const sidebarRef = useRef(null) // IMPORTANT: sidebar DOM node
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { isSidebarOpen, currentUrl } = useContext(CompleteDataContext)

  const sideBarData = useSelector((state: any) => state.sideBar.sideBarData)
  const isReportPageOpen = currentUrl.includes("report")

  useEffect(() => {
    if (!sideBarData || !sideBarData.name) fetchSideBarData()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? BRANCHES.filter((b) => b.name.toLowerCase().includes(q)) : BRANCHES
  }, [query])

  const content = (
    <div style={{ width: 340, maxWidth: "15vw", maxHeight: "65vh", display: "flex", flexDirection: "column", gap: 12 }}>
      <Input
        allowClear
        size="large"
        placeholder="Search for a branch"
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ borderRadius: 12 }}
      />
      <div style={{ overflow: "auto", paddingRight: 4 }}>
        <List
          dataSource={filtered}
          split={false}
          renderItem={(item) => (
            <List.Item style={{ padding: 0 }}>
              <button
                type="button"
                onClick={() => {
                  // handle branch select here
                  setOpen(false)
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  borderRadius: 12,
                  background: "#f5f5f5",
                  padding: "14px 20px",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eee")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f5f5")}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>{item.name}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    width: 40,
                    borderRadius: 9999,
                    border: "2px solid #6d28d9",
                    color: "#6d28d9",
                  }}
                >
                  <SwapOutlined />
                </span>
              </button>
            </List.Item>
          )}
        />
      </div>
    </div>
  )

  // const branchComponent = {}

  const organizationComponent =
    sideBarData?.name ? <SidebarOrganization orgData={sideBarData} /> : null

  return (
    <div
      ref={sidebarRef}
      className={isSidebarOpen ? "sidebar" : "sidebar h-hidden-medium-down"}
      style={{
        // Make the sidebar a flex column and scrollable
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "auto",
      }}
    >
      <div className="header-logo-container">
        <Link className="header-logo" to="/">
          <LatestLogo fill="white" />
        </Link>
      </div>

      <ul className="sidebar-org-container">{organizationComponent}</ul>

      {/* Push everything below to the bottom */}
      <div style={{ marginTop: "auto", padding: "12px 16px" }}>
        <Popover
          // Force it ABOVE the button, aligned to the left edge
          placement="top"
          // Prevent auto flip to bottom
          autoAdjustOverflow={false}
          trigger="click"
          open={open}
          onOpenChange={setOpen}
          // content={content}
          content={<BranchSwitcher query={query} setQuery={setQuery} />}
          arrow={{ pointAtCenter: true }}
          // Render INSIDE the sidebar so positioning is relative to it
          getPopupContainer={() => sidebarRef.current || document.body}
          overlayInnerStyle={{ padding: 16, borderRadius: 12 }}
          destroyTooltipOnHide
        >
          <Button
            type="primary"
            size="large"
            // icon={<SwapOutlined />}
            onClick={() => setOpen((v) => !v)}
            style={{right:35, width: "135%", height: 44, borderRadius: 10, background: "#8686864D" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 20,
                borderRadius: 9999,
                border: "2px solid #f5f5f5",
                color: "#f5f5f5",
              }}
            >
              <SwapOutlined />
            </span>
            {/* Switch Branch */}
            <span style={{ fontSize: 16, marginLeft:7, fontWeight: 400, color: "#f5f5f5" }}>Switch Branch</span>
          </Button>
        </Popover>
      </div>
    </div>
  )
}

const mapDispatchToProps = { fetchSideBar }
export default connect(null, mapDispatchToProps)(Sidebar)