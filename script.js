// GitHub 저장소의 파일 목록을 불러와 표에 채워 넣는 스크립트
const OWNER = "stkim506";
const REPO  = "stkim506.github.io";

// 특정 경로(path)의 파일 목록을 GitHub Contents API로 가져오기
async function fetchFiles(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("GitHub API 오류:", res.status, path);
      return [];
    }
    const data = await res.json();

    // 파일만 골라내고, 숨김 파일(.gitkeep 등)은 제외
    return data.filter(item =>
      item.type === "file" &&
      !item.name.startsWith(".") &&
      item.name !== ".gitkeep"
    );
  } catch (e) {
    console.error("fetchFiles 예외:", e);
    return [];
  }
}

// 2컬럼(파일 이름 / 다운로드) 테이블 렌더링
function renderTwoColumnTable(tableId, items) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!items || items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "등록된 파일이 없습니다.";
    td.classList.add("empty-row");
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  items.forEach(item => {
    const tr = document.createElement("tr");

    // 1. 파일 이름
    const nameTd = document.createElement("td");
    nameTd.textContent = item.name || "";
    tr.appendChild(nameTd);

    // 2. 다운로드 링크
    const linkTd = document.createElement("td");
    const a = document.createElement("a");
    // GitHub Contents API에서 내려주는 download_url 사용
    a.href = item.download_url || item.html_url;
    a.textContent = "보기 / 다운로드";
    a.target = "_blank";
    linkTd.appendChild(a);
    tr.appendChild(linkTd);

    tbody.appendChild(tr);
  });
}

// path에서 파일 목록을 가져와서 해당 테이블에 채우는 헬퍼
async function loadTable(tableId, path) {
  const files = await fetchFiles(path);
  renderTwoColumnTable(tableId, files);
}

document.addEventListener("DOMContentLoaded", () => {
  // 논문: papers 폴더 내부 분류
  loadTable("papers-local",   "papers/local-autonomy");
  loadTable("papers-thought", "papers/self-governance");
  loadTable("papers-finance", "papers/local-finance");
  loadTable("papers-admin",   "papers/admin-theory");

  // 칼럼: columns 폴더
  loadTable("columns-table",  "columns");
});
