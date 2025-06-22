export const utilityConsumptnColumn = [
  {
    title: "Month",
    dataIndex: "month",
    key: "month",
    ellipsis: true
  },
  {
    title: "Actual Energy(kWh)",
    dataIndex: "value",
    key: "value",
    ellipsis: true,
    render: (value) => (
      <>
        {value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        }
      </>
    ),
  },
  {
    title: "Device Energy (kWh)",
    dataIndex: "name",
    key: "name",
    ellipsis: true
  },
  {
    title: "Time of use",
    dataIndex: "time_of_use",
    key: "time_of_use",
    ellipsis: true,
    render: (value) => (
      <>
        {value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        }
      </>
    ),
  },
  {
    title: "Expected Bill",
    dataIndex: "expected_bill",
    key: "expected_bill",
    ellipsis: true,
    render: (value) => (
      <>
        {value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        }
      </>
    ),
  },
  {
    title: "Last Bill Accuracy(%)",
    dataIndex: "last_bill_accuracy",
    key: "last_bill_accuracy",
    ellipsis: true,
    render: (value) => (
      <>
        {value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
        }
      </>
    ),
  },
]


export const solarHourConsumptnColumn = [
  {
    title: "Energy consumed during solar hours (kWh)",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Time of use",
    dataIndex: "value",
    key: "value",
    ellipsis: true,
    render: (value) => (
      <>
        {value
          ? value.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })
          : 0}
      </>
    ),
  },
]
export const bandCategorizationColumn = [
  {
    title: "Band",
    dataIndex: "band",
    ellipsis: true,
  },
  {
    title: "Total Hours(achieved)",
    dataIndex: "total_hours",
    ellipsis: true,
    render: (value) => (
      <>
        {Number(value).toLocaleString()} hours
      </>
    ),
  },
  {
    title: "Expected Hours",
    dataIndex: "expected_hours",
    ellipsis: true,
    render: (value) => (
      <>
        {Number(value).toLocaleString()} hours
      </>
    ),
  },
  {
    title: "Deviation (+or_)",
    dataIndex: "_",
    ellipsis: true,
    render: (_, values) => (
      <>
        {Number(values.total_hours - values.expected_hours).toLocaleString()} hours
      </>
    ),
  },
  {
    title: "Percentage Compliance",
    dataIndex: "_",
    ellipsis: true,
    render: (_, values) => (
      <>
        {((values.total_hours / values.expected_hours) * 100).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%
      </>
    ),
  },
]
export const deviationUsageBreakdownColumn = [
  {
    title: 'Category',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Energy (kWh)',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Percentage of Total (%)',
    dataIndex: 'percentage',
    key: 'percentage',
    render: (text) => `${text}%`
  }
];

export const deviationUtitlityAndDieselColumn = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    render: (text, record) => `${record.month || new Date().toLocaleString('default', { month: 'long' })}`
  },
  {
    title: "Category",
    dataIndex: "name",
    key: "name",
    width: '20%',
    render: (text) => (
      <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{text.replace("(KWH)", '')}</span>
    )
  },
  {
    title: "Energy (kWh)",
    dataIndex: "value",
    key: "value",
    width: '20%',
    render: (value) => {
      const num = Number(value);
      return <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{isNaN(num) ? 0 : num.toLocaleString()}</span>;
    }
  },
  {
    title: "Time of Use (Hours)",
    dataIndex: "deviation_time_of_use",
    key: "deviation_time_of_use",
    width: '20%',
    render: (value) => {
      const num = Number(value);
      return <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{isNaN(num) ? 0 : num.toLocaleString()}</span>;
    }
  },
  {
    title: "Diesel (Liters)",
    dataIndex: "diesel_consumption",
    key: "diesel_consumption",
    width: '20%',
    render: (value) => {
      const num = Number(value);
      return <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{isNaN(num) ? 0 : num.toLocaleString()}</span>;
    }
  },
  {
    title: "Cost (Naira)",
    dataIndex: "deviation_cost",
    key: "deviation_cost",
    width: '20%',
    render: (value) => {
      const num = Number(value);
      return <span style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{isNaN(num) ? 0 : num.toLocaleString()}</span>;
    }
  },
];

export const fuelEfficiencyAccuracyComparisonColumn = [
  {
    title: "Category",
    dataIndex: "key",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    ellipsis: true,
  },
]
