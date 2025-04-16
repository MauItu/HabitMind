// controller/modules/chart.js
let chartInstance = null;

export function initChart() {
    const ctx = document.getElementById('habits-chart');
    if (!ctx) return;

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { /* ... */ },
        options: { /* ... */ }
    });
}

export function updateChart(newData) {
    if (!chartInstance) return;
    // Lógica para actualizar el gráfico con newData
    chartInstance.update();
}