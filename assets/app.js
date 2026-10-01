(() => {
  const packages = {
    check: {name: 'RESEARCH CHECK', price: '€59', description: 'Initial research to identify available records, possible military unit information and whether a more detailed family-history report can be created.'},
    report: {name: 'FAMILY HISTORY REPORT', price: '€249', description: 'Full personalized WWII research including military service, unit, documented locations, a timeline, relevant battles and campaigns, historical context, family photographs and documents, maps where useful, and research sources.'},
    archive: {name: 'COMPLETE FAMILY ARCHIVE', price: '€399', description: 'Everything in the Family History Report, plus extended research, additional historical documents and photographs, a detailed timeline, maps, additional historical context and a more comprehensive final family archive.'}
  };
  const dialogs = [...document.querySelectorAll('dialog')];
  let returnFocus = null;
  function openDialog(id, trigger) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    returnFocus = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.dialog, button)));
  document.querySelectorAll('[data-package]').forEach(button => button.addEventListener('click', () => {
    const selected = packages[button.dataset.package];
    if (!selected) return;
    document.getElementById('selected-package').textContent = selected.name;
    document.getElementById('selected-price').textContent = selected.price + ' EUR';
    document.getElementById('selected-description').textContent = selected.description;
    openDialog('order-dialog', button);
  }));
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (document.querySelector('dialog[open]')) return;
      document.body.classList.remove('modal-open');
      if (returnFocus?.isConnected && !returnFocus.closest('dialog')) returnFocus.focus({preventScroll:true});
    });
  });
  document.querySelectorAll('[data-switch]').forEach(button => button.addEventListener('click', () => {
    const originalTrigger = returnFocus;
    button.closest('dialog').close();
    openDialog(button.dataset.switch, originalTrigger);
  }));
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {event.preventDefault();selectTab(tabs[next], true);}
    });
  });
})();
