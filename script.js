// 공통: 2컬럼(파일 이름 / 다운로드)용 렌더 함수
function renderTwoColumnTable(tableId, items) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = '';

  items.forEach(function (item) {
    const tr = document.createElement('tr');

    // 1. 파일 이름
    const nameTd = document.createElement('td');
    nameTd.textContent = item.name || '';
    tr.appendChild(nameTd);

    // 2. 다운로드
    const linkTd = document.createElement('td');
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = '보기 / 다운로드';
      a.target = '_blank';
      linkTd.appendChild(a);
    } else {
      linkTd.textContent = '-';
    }
    tr.appendChild(linkTd);

    tbody.appendChild(tr);
  });
}

/*
  여기는 실제 데이터 넣는 부분입니다.
  원하시는 파일 경로에 맞게 url만 고쳐서 쓰시면 됩니다.
*/

// 1. 지방자치 논문
const papersLocal = [
  { name: '개편이론',        url: 'papers/local-autonomy/개편이론.pdf' },
  { name: '민자사업',        url: 'papers/local-autonomy/민자사업.pdf' },
  { name: '지역간정의[1]',   url: 'papers/local-autonomy/지역간정의[1].pdf' },
  { name: '홈룰-김석태',     url: 'papers/local-autonomy/홈룰-김석태.pdf' }
];

// 2. 자치사상 논문
const papersThought = [
  { name: 'tmp', url: 'papers/self-governance/tmp.pdf' }
];

// 3. 지방재정 논문
const papersFinance = [
  // 예시
  // { name: '지방재정-논문1', url: 'papers/local-finance/논문1.pdf' }
];

// 4. 행정이론 논문
const papersAdmin = [
  // 예시
  // { name: '행정이론-논문1', url: 'papers/admin-theory/논문1.pdf' }
];

// 5. 칼럼
const columns = [
  // 예시
  // { name: '2023년 칼럼1', url: 'columns/2023_칼럼1.pdf' }
];

// DOM 로드 후 테이블 채우기
document.addEventListener('DOMContentLoaded', function () {
  renderTwoColumnTable('papers-local',   papersLocal);
  renderTwoColumnTable('papers-thought', papersThought);
  renderTwoColumnTable('papers-finance', papersFinance);
  renderTwoColumnTable('papers-admin',   papersAdmin);
  renderTwoColumnTable('columns-table',  columns);
});
