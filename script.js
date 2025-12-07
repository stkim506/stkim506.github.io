// 폴더 내용을 실시간으로 불러와 표에 채우는 스크립트
// 하드코딩된 파일 목록이 아니라, GitHub Contents API를 통해
// 현재 저장소 내 폴더의 실제 파일 목록을 사용합니다.

// 현재 도메인 기준으로 OWNER/REPO 추론 (예: stkim506.github.io)
const host = window.location.host;          // "stkim506.github.io"
const OWNER = host.split(".")[0] || "stkim506";
const REPO  = host || (OWNER + ".github.io");

// 필요하다면 직접 지정해도 됩니다.
// const OWNER = "stkim506";
// const REPO  = "stkim506.github.io";

// GitHub Contents API에서 특정 경로(path)의 파일 목록 가져오기
async function fetchFiles(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  console.log("요청 URL:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("GitHub API 오류:", res.status, res.statusText);
      return { error: true, items: [] };
    }
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("예상치 못한 응답 형식:", data);
      return { error: true, items: [] };
    }

    // 파일만 골라내고, 숨김 파일(.gitkeep 등)은 제외
    const files = data.filter(item =>
      item.type === "file" &&
      !item.name.startsWith(".") &&
      item.name !== ".gitkeep"
    );

    console.log(path, "에서 불러온 파일:", files.map(f => f.name));
    return { error: false, items: files };
  } catch (e) {
    console.error("fetchFiles 예외:", e);
    return { error: true, items: [] };
  }
}

// 2컬럼(파일 이름 / 다운로드) 테이블 렌더링
function renderTwoColumnTable(tableId, result) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  if (result.error) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "목록을 불러오는 중 오류가 발생했습니다.";
    td.classList.add("error-row");
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const items = result.items;
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

    // GitHub Contents API에서 내려주는 download_url 사용 (원본 파일)
    // 일부 형식(.hwp 등)도 브라우저/OS 설정에 따라 다운로드 또는 열기로 동작
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
  const result = await fetchFiles(path);
  renderTwoColumnTable(tableId, result);
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
