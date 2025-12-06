// GitHub 계정/저장소 정보 (stkim506)
function getRepoInfo() {
  const owner = 'stkim506';
  const repo = 'stkim506.github.io';
  return { owner, repo };
}

// 파일명에서 연도 / 저널(또는 매체) / 제목 추출
// 예: 2024_행정학연구_주민자치와-풀뿌리-민주주의.hwpx
function parseFileInfo(name) {
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

// GitHub API로 특정 폴더(예: papers/admin-theory)를 읽어와 테이블에 채우기
async function loadFromGithub(path, tableBodySelector) {
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
      const info = parseFileInfo(item.name);
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
  // 논문 네 가지 분류
  loadFromGithub('papers/admin-theory', '#papers-admin tbody');       // 1. 행정이론
  loadFromGithub('papers/local-autonomy', '#papers-local tbody');     // 2. 지방자치
  loadFromGithub('papers/self-governance', '#papers-thought tbody');  // 3. 자치사상
  loadFromGithub('papers/local-finance', '#papers-finance tbody');    // 4. 지방재정

  // 칼럼
  loadFromGithub('columns', '#columns-table tbody');
});
