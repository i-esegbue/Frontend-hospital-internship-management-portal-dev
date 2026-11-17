
  
    document.addEventListener('DOMContentLoaded', function () {
      const table = $('#employee_dashboard_table').DataTable({
        responsive: true,
        paging: true,
        pageLength: 10,
        lengthChange: false,
        ordering: true,
        columnDefs: [{ orderable: false, targets: 0 }],
        dom: 't<"d-flex justify-content-between align-items-center mt-2"p>',
        language: {
          paginate: { previous: '<i class="bi bi-chevron-left"></i>', next: '<i class="bi bi-chevron-right"></i>' }
        }
      });

      const search = document.getElementById('tableSearch');
      if (search) {
        search.addEventListener('input', function () {
          table.search(this.value).draw();
        });
      }
    });
 