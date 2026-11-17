
  (function(){
    const STATUS = {APPLIED:'Applied', INTERVIEW:'Interview', REJECTED:'Rejected'};
    const table = $('#applicantsTable').DataTable({
      pageLength: 6,
      lengthChange: false,
      responsive: true,
      dom: 'rtip'
    });

    // wire search
    $('#tableSearch').on('input', function(){ table.search(this.value).draw(); });
    $('#refreshBtn').on('click', function(){ table.ajax && table.ajax.reload(); table.draw(); });

    const store = {}; 
    let currentRow = null;

    $('#appBody tr').each(function(i,row){
      const cells = $(row).children('td');
      const pid = 'app_' + i;
      store[pid] = {
        pid,
        first: cells.eq(1).text(),
        last: cells.eq(2).text(),
        email: cells.eq(3).text(),
        nationality: cells.eq(4).text(),
        university: cells.eq(4).text(),
        course: cells.eq(5).text(),
        role: cells.eq(5).text(),
        status: cells.eq(6).text(),
        cv: $(row).data('cv'),
        cover: $(row).data('cover'),
        row
      };
      addActions(cells.eq(7), pid);
    });

    function addActions(cell, pid){
      const a = store[pid];
      const btnGroup = $('<div class="btn-group" role="group" aria-label="Actions"></div>');
      btnGroup.append(`<button class="btn btn-sm btn-outline-secondary viewBtn" data-bs-toggle="tooltip" title="View details"><i class="bi bi-eye"></i></button>`);
      btnGroup.append(`<button class="btn btn-sm btn-outline-success offerBtn" data-bs-toggle="tooltip" title="Offer interview"><i class="bi bi-calendar-check"></i></button>`);
      btnGroup.append(`<button class="btn btn-sm btn-outline-danger rejectBtn" data-bs-toggle="tooltip" title="Reject"><i class="bi bi-x-circle"></i></button>`);
      btnGroup.append(`<a href="${a.cv}" download class="btn btn-sm btn-outline-dark" data-bs-toggle="tooltip" title="Download CV"><i class="bi bi-file-earmark-person"></i></a>`);
      btnGroup.append(`<a href="${a.cover}" download class="btn btn-sm btn-outline-dark" data-bs-toggle="tooltip" title="Download Cover"><i class="bi bi-file-earmark-text"></i></a>`);
      $(cell).append(btnGroup);
    }

    // initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (el) { return new bootstrap.Tooltip(el); });

    function toast(msg){
      const t = $(`<div class="toast align-items-center text-bg-dark border-0 show" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body small">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`);
      $('#toastArea').append(t);
      setTimeout(()=> t.remove(), 3500);
    }

    function openModal(pid){
      currentRow = pid;
      const a = store[pid];
      $('#modalFirst').text(a.first);
      $('#modalLast').text(a.last);
      $('#modalEmail').text(a.email);
      $('#modalNation').text(a.nationality);
      $('#modalUniv').text(a.university);
      $('#modalCourse').text(a.course);
      $('#modalRole').text(a.role);
      $('#modalStatus').text(a.status);
      $('#modalCV').attr('href',a.cv);
      $('#modalCover').attr('href',a.cover);
      new bootstrap.Modal(document.getElementById('applicantModal')).show();
    }

    function updateStatus(pid, status){
      const a = store[pid];
      a.status = status;
      $(a.row).children().eq(6).text(status);
      $('#modalStatus').text(status);
      toast(`${a.first} ${a.last} → ${status}`);
    }

    $('body').on('click','.viewBtn', function(){ openModal(getPid(this)); });
    $('body').on('click','.offerBtn', function(){ updateStatus(getPid(this), STATUS.INTERVIEW); });
    $('body').on('click','.rejectBtn', function(){ updateStatus(getPid(this), STATUS.REJECTED); });

    $('#modalOffer').click(()=> { if(currentRow) updateStatus(currentRow, STATUS.INTERVIEW); });
    $('#modalReject').click(()=> { if(currentRow) updateStatus(currentRow, STATUS.REJECTED); });

    function getPid(btn){ return 'app_'+ $(btn).closest('tr').index(); }
  })();
 