// employee_dashboard.js
    document.addEventListener('DOMContentLoaded', function () {
      // DataTable init
      const table = $('#employee_dashboard_table').DataTable({
        responsive: true,
        pageLength: 10,
        lengthChange: false,
        ordering: true,
        dom: 't<"d-flex justify-content-end mt-2"p>',
        columnDefs: [{ orderable: false, targets: [] }],
        language: {
          paginate: { previous: '<i class="bi bi-chevron-left"></i>', next: '<i class="bi bi-chevron-right"></i>' }
        }
      });

      // Wire search input
      const search = document.getElementById('tableSearch');
      if (search) search.addEventListener('input', () => table.search(search.value).draw());

      // KPI values derived from table (placeholder logic)
      const I_interviewing = table.rows().count();
      document.getElementById('interviewing').textContent = I_interviewing;
      const I_successful = Math.max(0, Math.round(I_interviewing * 0.33));
      document.getElementById('successful').textContent = I_successful;
      const I_totalApplicants = 68;
      document.getElementById('totalApplicants').textContent = I_totalApplicants ;
      // Small donut charts for KPI cards (Chart.js)
      function makeDoughnut(ctx, value, totalColor, accentColor) {
        return new Chart(ctx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [value, 100 - value],
              backgroundColor: [accentColor, '#E9EEF8'],
              hoverBackgroundColor: [accentColor, '#E9EEF8'],
              borderWidth: 0
            }]
          },
          options: {
            cutout: '75%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            maintainAspectRatio: false
          }
        });
      }

      // Render KPI mini-charts with placeholder percentages
      makeDoughnut(document.getElementById('kpiTotalChart').getContext('2d'), Math.min(100, Math.round((I_interviewing/40)*100)), '#E9EEF8', '#0d6efd');
      makeDoughnut(document.getElementById('kpiInChart').getContext('2d'), Math.min(100, Math.round((I_successful/20)*100)), '#E9EEF8', '#f59e0b');
      makeDoughnut(document.getElementById('kpiOccupancy').getContext('2d'), I_totalApplicants, '#E9EEF8', '#10b981');
    });
    
 