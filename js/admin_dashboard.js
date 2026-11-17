// js/admin_dashboard.js
    document.addEventListener('DOMContentLoaded', function () {

      // Initialize DataTable
      const table = $('#employee_dashboard_table').DataTable({
        pageLength: 10,
        lengthChange: false,
        order: [[0, 'asc']],
        columnDefs: [{ orderable: false, targets: [2,3,4,5] }]
      });

      // Table quick filter wired to top input
      const tableSearch = document.getElementById('tableSearch');
      if (tableSearch) {
        tableSearch.addEventListener('input', function () {
          table.search(this.value).draw();
        });
      }

      // Export CSV (simple client-side)
      document.getElementById('exportBtn').addEventListener('click', function () {
        const csv = [];
        const rows = document.querySelectorAll('#employee_dashboard_table tr');
        rows.forEach(row => {
          const cols = Array.from(row.querySelectorAll('th,td')).map(td => `"${(td.innerText||'').replace(/"/g,'""')}"`);
          if (cols.length) csv.push(cols.join(','));
        });
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'appointments.csv'; document.body.appendChild(a); a.click();
        URL.revokeObjectURL(url); a.remove();
      });

      // Placeholder data for charts
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const applicantsData = [90,120,150,140,180,200,190,220,210,230,240,260];

      // Applicants line chart
      const applicantsCtx = document.getElementById('applicantsChart').getContext('2d');
      new Chart(applicantsCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Applicants',
            data: applicantsData,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13,110,253,0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 3
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          responsive: true,
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 50 } }
          }
        }
      });

      // Category distribution (doughnut)
      const categoryCtx = document.getElementById('categoryChart').getContext('2d');
      new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
          labels: ['Nursing','Dental','Pharmacy','Physio','Admin'],
          datasets: [{
            data: [45, 15, 12, 10, 18],
            backgroundColor: ['#0d6efd','#6f42c1','#20c997','#ffc107','#fd7e14']
          }]
        },
        options: { plugins: { legend: { position: 'bottom' } }, responsive: true }
      });

      // Locations bar
      const locationsCtx = document.getElementById('locationsChart').getContext('2d');
      new Chart(locationsCtx, {
        type: 'bar',
        data: {
          labels: ['Preston','Blackburn','Lancaster','Chorley'],
          datasets: [{
            label: 'Open roles',
            data: [18, 9, 12, 7],
            backgroundColor: '#17a2b8'
          }]
        },
        options: { plugins: { legend: { display: false } }, responsive: true }
      });

      // Update summary cards from placeholder aggregate calculations
      const totalApplicants = applicantsData.reduce((a,b)=>a+b,0);
      document.getElementById('statApplicants').textContent = totalApplicants.toLocaleString();
      document.getElementById('statRoles').textContent = 48; // placeholder
      document.getElementById('statCategory').textContent = 'Nursing';
      document.getElementById('statTime').textContent = '14d';
    });
  