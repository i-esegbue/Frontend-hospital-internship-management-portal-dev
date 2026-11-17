
    document.addEventListener('DOMContentLoaded', function () {
      // Init DataTable
      const table = $('#employee_dashboard_table').DataTable({
        responsive: true,
        pageLength: 10,
        lengthChange: false,
        ordering: true,
        order: [[0, 'asc']],
        columnDefs: [{ orderable: false, targets: [3] }],
        dom: '<"d-flex justify-content-end mb-2"p>t',
        language: {
          paginate: {
            previous: '<i class="bi bi-chevron-left"></i>',
            next: '<i class="bi bi-chevron-right"></i>'
          }
        }
      });

      // Small search wired to DataTable
      const tableSearch = document.getElementById('tableSearch');
      if (tableSearch) {
        tableSearch.addEventListener('input', function () {
          table.search(this.value).draw();
        });
      }

      // Add Data modal handling (improved button)
      const addDataBtn = document.getElementById('addDataBtn');
      const addDataModalEl = document.getElementById('addDataModal');
      const addDataModal = new bootstrap.Modal(addDataModalEl);
      const addDataForm = document.getElementById('addDataForm');

      addDataBtn.addEventListener('click', function () {
        addDataForm.reset();
        addDataModal.show();
      });

      addDataForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fd = new FormData(addDataForm);
        const name = fd.get('name') || '';
        const diagnosis = fd.get('diagnosis') || '';
        const doctor = fd.get('doctor') || '';
        const nurse = fd.get('nurse') || '';
        const support = fd.get('support') || '';
        const location = fd.get('location') || '';
        const age = fd.get('age') || '';

        const nextIndex = table.rows().count() + 1;

        table.row.add([
          nextIndex,
          name,
          diagnosis,
          doctor ? `<select class="form-select sm"><option selected>${doctor}</option></select>` : `<select class="form-select sm"><option selected disabled>Assign Doctor</option><option>Dr Oscroch</option><option>Dr Ifeanyi</option><option>Dr Ardash</option><option>Dr Riyan</option><option>Dr Willis</option><option>Dr Caramel</option><option>Dr Bread</option></select>`,
          nurse,
          support,
          location,
          age
        ]).draw(false);

        addDataModal.hide();
      });
    });
 