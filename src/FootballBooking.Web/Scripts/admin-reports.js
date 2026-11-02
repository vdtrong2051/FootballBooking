import Chart from "chart.js/auto";

const palette = {
  success: { border: "#15803d", background: "rgba(21, 128, 61, 0.24)" },
  info: { border: "#1d4ed8", background: "rgba(29, 78, 216, 0.26)" },
  active: { border: "#0f766e", background: "rgba(15, 118, 110, 0.24)" },
  warning: { border: "#d97706", background: "rgba(217, 119, 6, 0.24)" },
  danger: { border: "#dc2626", background: "rgba(220, 38, 38, 0.24)" }
};

const formatValue = (value) => {
  const num = Number(value) || 0;
  if (Math.abs(num) >= 1000) {
    return `${num.toLocaleString("vi-VN")} ₫`;
  }

  return num.toLocaleString("vi-VN");
};

const formatSignedValue = (value) => {
  const num = Number(value) || 0;
  const prefix = num > 0 ? "+" : "";
  return `${prefix}${formatValue(num)}`;
};

const buildWaterfallDataset = (dataset) => {
  const steps = Array.isArray(dataset.waterfallSteps) && dataset.waterfallSteps.length > 0
    ? dataset.waterfallSteps
    : (dataset.data || []).map((val, idx, arr) => {
        const prev = arr.slice(0, idx).reduce((sum, item) => sum + Number(item || 0), 0);
        const delta = Number(val || 0);
        return {
          label: `#${idx + 1}`,
          delta,
          start: prev,
          end: prev + delta,
          tone: delta >= 0 ? "success" : "danger",
          isTotal: false
        };
      });

  const borderColors = steps.map((step) => {
    if (step.isTotal) return palette.info.border;
    return step.delta >= 0 ? palette.success.border : palette.danger.border;
  });

  const backgroundColors = steps.map((step) => {
    if (step.isTotal) return palette.info.background;
    return step.delta >= 0 ? palette.success.background : palette.danger.background;
  });

  return {
    type: "bar",
    label: dataset.label || "Biểu đồ thác nước",
    data: steps.map((step) => [step.start, step.end]),
    waterfallSteps: steps,
    borderColor: borderColors,
    backgroundColor: backgroundColors,
    borderWidth: 2,
    borderRadius: 4,
    borderSkipped: false
  };
};

const buildDataset = (dataset) => {
  if (dataset.type === "waterfall" || Array.isArray(dataset.waterfallSteps)) {
    return buildWaterfallDataset(dataset);
  }

  const colors = palette[dataset.tone] || palette.info;
  return {
    type: dataset.type || "bar",
    label: dataset.label,
    data: dataset.data,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderRadius: dataset.type === "bar" ? 4 : 0,
    tension: 0.28,
    fill: dataset.type === "line"
  };
};

const toMonthlyPayload = (payload) => {
  const monthTotals = new Map();
  payload.labels.forEach((label, index) => {
    const parts = String(label).split("/");
    const month = parts.length === 3 ? Number(parts[1]) : Number.NaN;
    if (!Number.isFinite(month)) {
      return;
    }

    const monthLabel = `Tháng ${month}`;
    const stepDelta = payload.datasets[0]?.waterfallSteps?.[index]?.delta ?? payload.datasets[0]?.data[index] ?? 0;
    monthTotals.set(monthLabel, (monthTotals.get(monthLabel) || 0) + Number(stepDelta));
  });

  const steps = [];
  let running = 0;
  for (const [label, delta] of monthTotals.entries()) {
    const start = running;
    running += delta;
    steps.push({
      label,
      delta,
      start,
      end: running,
      tone: delta >= 0 ? "success" : "danger",
      isTotal: false
    });
  }

  steps.push({
    label: "Tổng quý",
    delta: running,
    start: 0,
    end: running,
    tone: "info",
    isTotal: true
  });

  return {
    labels: steps.map((s) => s.label),
    datasets: payload.datasets.map((dataset) => ({
      ...dataset,
      type: "waterfall",
      data: steps.map((s) => s.delta),
      waterfallSteps: steps
    }))
  };
};

const renderChart = async (canvas) => {
  const url = canvas.dataset.chartUrl;
  const errorElement = canvas.closest("section")?.querySelector("[data-chart-error]");

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error("Không tải được dữ liệu biểu đồ.");
    }

    const rawPayload = await response.json();
    const payload = canvas.dataset.chartMode === "quarter-monthly" ? toMonthlyPayload(rawPayload) : rawPayload;
    new Chart(canvas, {
      data: {
        labels: payload.labels,
        datasets: payload.datasets.map(buildDataset)
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index"
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 10,
              color: "#334155",
              font: { family: "Inter, system-ui, sans-serif" }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const steps = context.dataset.waterfallSteps;
                if (Array.isArray(steps) && steps[context.dataIndex]) {
                  const step = steps[context.dataIndex];
                  if (step.isTotal) {
                    return `${step.label}: ${formatValue(step.end)}`;
                  }
                  return `${step.label}: ${formatSignedValue(step.delta)} (Lũy kế: ${formatValue(step.end)})`;
                }

                return `${context.dataset.label}: ${formatValue(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#64748b", maxRotation: 0, autoSkip: true },
            grid: { color: "#e2e8f0" }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#64748b", callback: formatValue },
            grid: { color: "#e2e8f0" }
          }
        }
      }
    });
  } catch {
    errorElement?.classList.remove("hidden");
  }
};

document.querySelectorAll("[data-report-chart]").forEach((canvas) => {
  renderChart(canvas);
});
