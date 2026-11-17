// js/studentform.js
    // Utility
    const el = id => document.getElementById(id);

    // File helpers
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxBytes = 5 * 1024 * 1024; // 5MB

    let resumeFile = null;
    let coverFile = null;

    function humanSize(n){ if(n<1024) return n+' B'; if(n<1024*1024) return (n/1024).toFixed(1)+' KB'; return (n/(1024*1024)).toFixed(2)+' MB' }

    function setFileMeta(containerId, file){
      const c = el(containerId);
      c.innerHTML = '';
      if(!file) return;
      const name = document.createElement('div');
      name.innerHTML = `<strong>${file.name}</strong> <small class="text-muted">(${humanSize(file.size)})</small>`;
      const remove = document.createElement('button');
      remove.type='button';
      remove.className='btn btn-sm btn-outline-danger ms-2';
      remove.textContent='Remove';
      remove.addEventListener('click', ()=> {
        if(containerId==='resumeMeta'){ resumeFile=null; el('resumeError').style.display='none'; setFileMeta('resumeMeta', null); }
        if(containerId==='coverMeta'){ coverFile=null; el('coverError').style.display='none'; setFileMeta('coverMeta', null); }
      });
      c.appendChild(name); c.appendChild(remove);
    }

    function handleDrop(files, target){
      const f = files[0];
      if(!f) return;
      if(!allowed.includes(f.type)){
        el(target+'Error').textContent = 'Invalid file type. Use PDF/DOC/DOCX.'; el(target+'Error').style.display='';
        return;
      }
      if(f.size > maxBytes){
        el(target+'Error').textContent = 'File too large. Max 5MB.'; el(target+'Error').style.display='';
        return;
      }
      el(target+'Error').style.display='none';
      if(target==='resume'){ resumeFile = f; setFileMeta('resumeMeta', f); }
      else { coverFile = f; setFileMeta('coverMeta', f); }
    }

    // Wire dropzones
    ['resumeDrop','coverDrop'].forEach(id => {
      const drop = el(id);
      drop.addEventListener('click', ()=> {
        const inp = document.createElement('input'); inp.type='file'; inp.accept='.pdf,.doc,.docx'; inp.onchange = (e)=> handleDrop(e.target.files, id==='resumeDrop' ? 'resume' : 'cover');
        inp.click();
      });
      ['dragover','dragenter'].forEach(evt=> drop.addEventListener(evt, (e)=>{ e.preventDefault(); drop.classList.add('hover'); }));
      ['dragleave','dragend','drop'].forEach(evt=> drop.addEventListener(evt, (e)=>{ e.preventDefault(); drop.classList.remove('hover'); }));
      drop.addEventListener('drop', (e)=> {
        const dt = e.dataTransfer;
        handleDrop(dt.files, id==='resumeDrop' ? 'resume' : 'cover');
      });
    });

    // Form feedback
    function showFeedback(msg, type='info'){
      const fb = el('formFeedback'); fb.innerHTML = `<div class="alert alert-${type} p-2">${msg}</div>`;
      setTimeout(()=> { if(fb) fb.innerHTML=''; }, 6000);
    }

    // Status UI update
    function updateStatus(status){
      const steps = Array.from(document.querySelectorAll('.step'));
      steps.forEach(s => s.classList.toggle('active', s.dataset.step.toLowerCase()===status.toLowerCase()));
      el('currentStatus').textContent = status;
      el('statusTime').textContent = new Date().toLocaleString();
    }

    // Mock submit with validation and progress
    el('applicationForm').addEventListener('submit', function(e){
      e.preventDefault();
      // reset errors
      ['resumeError','coverError'].forEach(id=> el(id).style.display='none');
      // basic validation
      const required = ['firstName','lastName','email','phone','jobRole'];
      let ok = true;
      required.forEach(id=> { if(!el(id).value.trim()){ ok=false; el(id).classList.add('is-invalid'); } else el(id).classList.remove('is-invalid'); });
      if(!resumeFile){ ok=false; el('resumeError').textContent='Resume is required'; el('resumeError').style.display=''; }
      if(!el('consent').checked){ ok=false; showFeedback('You must consent to processing before submitting', 'danger'); }
      if(!ok) return;

      // disable submit button
      el('submitBtn').disabled = true;

      // show progress bar
      const fb = el('formFeedback'); fb.innerHTML = `
        <div class="mb-2"><strong>Uploading...</strong></div>
        <div class="progress"><div id="uploadBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width:0%">0%</div></div>
      `;
      let pct = 0;
      const iv = setInterval(()=> {
        pct += Math.floor(Math.random()*15) + 5;
        if(pct>100) pct=100;
        const bar = el('uploadBar');
        bar.style.width = pct + '%'; bar.textContent = pct + '%';
        if(pct>=100){
          clearInterval(iv);
          // finalize
          setTimeout(()=> {
            showFeedback('Application submitted successfully — reference: APP-' + Date.now(), 'success');
            updateStatus('Submitted');
            // mark form read-only (demo)
            Array.from(document.querySelectorAll('#applicationForm input, #applicationForm select, #applicationForm textarea, #applicationForm button')).forEach(i=> { if(i.id!=='submitBtn') i.disabled=true; });
            // keep submit disabled after finish
            el('submitBtn').disabled = true;
          }, 600);
        }
      }, 400);
    });

    // Print summary action (keeps UI simple)
    el('printSummary').addEventListener('click', () => {
      window.print();
    });

    // Initial status
    document.addEventListener('DOMContentLoaded', ()=> {
      updateStatus('Submitted');
    });
 