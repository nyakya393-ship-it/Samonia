let data = JSON.parse(localStorage.getItem("samolog") || "[]");

function go(i){
  document.querySelectorAll(".page").forEach((p,idx)=>{
    p.classList.toggle("active",idx===i);
  });

  document.querySelectorAll(".tab").forEach((t,idx)=>{
    t.classList.toggle("active",idx===i);
  });

  render();
}

function add(){
showToast("保存しました");
  data.push({
    id:Date.now(),
    stage:stage.value,
    result:result.value,
    special:special.value,
    gold:+gold.value||0,
    goldA:+goldA.value||0,
    red:+red.value||0
  });

  localStorage.setItem("samolog",JSON.stringify(data));
  render();
}

/* 戦績 */
function render(){

  const p1 = document.getElementById("p1");

  if(data.length === 0){
    p1.innerHTML = `<div class="battleCard" style="text-align:center;opacity:.6;">戦績がありません</div>`;
    analyze();
    return;
  }

  p1.innerHTML =
    data.map((d, i)=>`

      <div class="battleCard" onclick="openDetail(${i})">
        <b>${d.stage}</b><br>
        ${d.result}<br>
        ${d.special}<br>
        金:${d.gold} / アシ:${d.goldA} / 赤:${d.red}

        <button onclick="remove(${i})" style="
          margin-top:10px;
          background:#ff4d4d;
          color:#fff;
          border:none;
          padding:10px;
          border-radius:12px;
          font-weight:900;
        ">
          削除
        </button>
      </div>

    `).join("");

  analyze();
}
/* 分析 */
function analyze(){

  const empty = document.getElementById("avgGold");

  if(data.length === 0){
    document.getElementById("avgGold").innerText = "-";
    document.getElementById("avgAssist").innerText = "-";
    document.getElementById("avgRed").innerText = "-";
    document.getElementById("winRate").innerText = "-";

    return;
  }

  const avg = key =>
    data.reduce((a,b)=>a + (b[key] || 0), 0) / data.length;

  const win = data.filter(d => d.result.includes("成功")).length;

  document.getElementById("avgGold").innerText = Math.round(avg("gold"));
  document.getElementById("avgAssist").innerText = Math.round(avg("goldA"));
  document.getElementById("avgRed").innerText = Math.round(avg("red"));
  document.getElementById("winRate").innerText =
    Math.round((win / data.length) * 100) + "%";
}
function remove(index){
  showToast("削除しました");
  data.splice(index, 1);
  localStorage.setItem("samolog", JSON.stringify(data));
  render();
}
function showToast(text){
  const toast = document.getElementById("toast");
  toast.innerText = text;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  }, 1500);
}
function openDetail(index){

  const d = data[index];

  const detail = document.getElementById("detail");

  detail.innerHTML = `
    <div style="font-size:22px;font-weight:900;margin-bottom:10px;">
      詳細
    </div>

    <div style="line-height:1.8;">
      <b>ステージ：</b>${d.stage}<br>
      <b>結果：</b>${d.result}<br>
      <b>スペシャル：</b>${d.special}<br><br>

      <b>金イクラ：</b>${d.gold}<br>
      <b>アシスト：</b>${d.goldA}<br>
      <b>赤イクラ：</b>${d.red}<br><br>

      <b>ID：</b>${d.id}
    </div>

    <button onclick="closeDetail()" style="
      margin-top:20px;
      width:100%;
      padding:14px;
      border:none;
      border-radius:12px;
      background:#ffb347;
      font-weight:900;
    ">
      戻る
    </button>
  `;

  detail.classList.add("active");
}
function closeDetail(){
  document.getElementById("detail").classList.remove("active");
}
