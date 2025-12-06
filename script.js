async function loadList(jsonPath, tableBodySelector, type) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) {
      console.error('Failed to load', jsonPath);
      return;
    }
    const items = await res.json();
    const tbody = document.querySelector(tableBodySelector);
    tbody.innerHTML = '';

    items.forEach(item => {
      const tr = document.createElement('tr');

      const yearTd = document.createElement('td');
      yearTd.textContent = item.year || '';
      tr.appendChild(yearTd);

      const titleTd = document.createElement('td');
      titleTd.textContent = item.title || '';
      tr.appendChild(titleTd);

      const metaTd = document.createElement('td');
      metaTd.textContent = item.journal || item.media || '';
      tr.appendChild(metaTd);

      const fileTd = document.createElement('td');
      if (item.file) {
        const link = document.createElement('a');
        link.href = item.file;
        link.textContent = '보기/다운로드';
        link.target = '_blank';
        fileTd.appendChild(link);
      } else {
        fileTd.textContent = '-';
      }
      tr.appendChild(fileTd);

      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadList('data/papers.json', '#papers-table tbody', 'paper');
  loadList('data/columns.json', '#columns-table tbody', 'column');
});
