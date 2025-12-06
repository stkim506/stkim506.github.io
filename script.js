function getRepoInfo() {
  // 예: https://eugeniakkim.github.io/
  const host = window.location.hostname; // eugeniakkim.github.io
  const parts = host.split('.');
  const owner = parts[0];
  const repo = owner + '.github.io';
  return { owner, repo };
}

function parseFileInfo(name, type) {
  // 파일명 예시:
  // 논문: 2024_행정학연구_주민자치와-풀뿌리-민주주의.hwpx
  // 칼럼: 2023_○○신문_주민자치회와-풀뿌리-민주주의.hwpx
  const noExt = name.replace(/\.[^/.]+$/, '');
  const parts = noExt.split('_');

  let year = '';
  let journalOrMedia = '';
  let title = noExt;

  if (parts.length >= 3) {
    year = parts[0];
    journalOrMedia = parts[1];
    title = parts.slice(2).join(' ');
  }

  return {
    year,
    journalOrMedia,
    title
  };
}

async function loadFromGithub(path, tableBodySelector, type) {
  const { owner, repo } = getRepoInfo();
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error('GitHub API 불러오기 실패:', apiUrl);
      return;
    }

    const data = await res.json();
    const files = Array.isArray(data) ? data.filter(item => item.type === 'file') : [];
    const tbody = document.querySelector(tableBodySelector);
    if (!tbody) return;
    tbody.innerHTML = '';

    files.forEach(item => {
      const info = parseFileInfo(item.name, type);
      const tr = document.createElement('tr');

      const yearTd = document.createElement('td');
      yearTd.textContent = info.year;
      tr.appendChild(yearTd);

      const titleTd = document.createElement('td');
      titleTd.textContent = info.title;
      tr.appendChild(titleTd);

      const metaTd = document.createElement('td');
      metaTd.textContent = info.journalOrMedia;
      tr.appendChild(metaTd);

      const fileTd = document.createElement('td');
      const link = document.createElement('a');
      link.href = item.download_url || item.html_url;
      link.textContent = '보기/다운로드';
      link.target = '_blank';
      fileTd.appendChild(link);
      tr.appendChild(fileTd);

      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromGithub('papers', '#papers-table tbody', 'paper');
  loadFromGithub('columns', '#columns-table tbody', 'column');
});
