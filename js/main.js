let chart = null; // Global chart instance

const crimeTypes = [
  'rape',
  'kidnapping_abduction',
  'dowry_deaths',
  'assault_on_women',
  'assault_on_modesty',
  'domestic_violence',
  'women_trafficking'
];

// 🎨 Netflix-style custom palette
function generateColors(count) {
  const palette = [
    '#FFA59A', '#402220', '#FF492A', '#CB1C00', '#812317',
    '#7D3D33', '#6A1300', '#450900', '#330600', '#954736', '#1F0505'
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}

// Load available states dynamically from PHP
function loadStates() {
  fetch('php/get_states.php')
    .then(res => res.json())
    .then(states => {
      const stateSelect = document.getElementById('state');
      if (!stateSelect) return;
      stateSelect.innerHTML = '<option value="">Select State</option>';
      states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    })
    .catch(err => console.error("Failed to load states:", err));
}

// Render the filters dynamically based on selected trend
function renderFilters() {
  const trend = document.getElementById('trend').value;
  const filtersDiv = document.getElementById('filters');
  filtersDiv.innerHTML = '';

  if (trend === 'specific_crime_trend') {
    filtersDiv.innerHTML += `
      <label>Crime Type:</label>
      <select id="crimeType">
        ${crimeTypes.map(c => `<option value="${c}">${c.replace(/_/g, ' ')}</option>`).join('')}
      </select>
    `;
  }

  if (trend === 'state_crime_breakdown') {
    filtersDiv.innerHTML += `
      <label>State:</label>
      <select id="state">
        <option value="">Select State</option>
      </select>
    `;
    loadStates();
  }
}

// Render the chart
function renderGraph() {
  const trend = document.getElementById('trend').value;
  const chartType = document.getElementById('chartType').value;
  let url = `php/get_trend_data.php?trend=${trend}`;

  if (trend === 'specific_crime_trend') {
    const crimeType = document.getElementById('crimeType').value;
    url += `&crimeType=${crimeType}`;
  }

  if (trend === 'state_crime_breakdown') {
    const state = document.getElementById('state').value;
    if (!state) {
      alert("Please select a state.");
      return;
    }
    url += `&state=${encodeURIComponent(state)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);

      if (chart) chart.destroy();

      const ctx = document.getElementById('chartCanvas').getContext('2d');
      chart = new Chart(ctx, {
        type: chartType,
        data: {
          labels: labels,
          datasets: [{
            label: formatLabel(trend),
            data: values,
            backgroundColor: generateColors(values.length),
            borderColor: generateColors(values.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: chartType !== 'pie' ? {
            y: { beginAtZero: true }
          } : {}
        }
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load data. Please check your server or input values.");
    });
}

// Format label for display
function formatLabel(text) {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Reset the canvas
function resetGraph() {
  if (chart) {
    chart.destroy();
    chart = null;
  }
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Download chart as PNG
function downloadChart() {
  const canvas = document.getElementById("chartCanvas");
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "crime_chart.png";
  link.click();
}

// DOM load hooks
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('trend').addEventListener('change', renderFilters);
  document.getElementById('chartType').addEventListener('change', renderGraph);
  document.getElementById('renderBtn')?.addEventListener('click', renderGraph);
  document.getElementById('resetBtn')?.addEventListener('click', resetGraph);
  document.getElementById('downloadBtn')?.addEventListener('click', downloadChart);

  // Load default filters/states
  renderFilters();
});
