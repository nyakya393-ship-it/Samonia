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

<button onclick="event.stopPropagation(); remove(${i})" style="
  margin-top:10px;
  background:linear-gradient(135deg,#ff4d4d,#c40000);
  color:#fff;
  border:none;
  padding:10px 14px;
  border-radius:12px;
  font-weight:900;
  font-size:13px;
  width:100%;
  box-shadow:0 4px 12px rgba(255,0,0,.25);
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
const specials = {};

data.forEach(d=>{
  if(!specials[d.special]){
    specials[d.special] = {total:0, win:0};
  }

  specials[d.special].total++;

  if(d.result.includes("成功")){
    specials[d.special].win++;
  }
});

/* 配列にしてランキング化 */
const list = Object.keys(specials).map(sp=>{
  const s = specials[sp];
  const rate = (s.win / s.total) * 100;

  return {
    name: sp,
    rate: rate
  };
});

/* 成功率順に並び替え */
list.sort((a,b)=>b.rate - a.rate);

/* 表示 */
document.getElementById("specialRank").innerHTML =
  list.map(s=>`
    <div class="specialItem">
      <div class="specialName">${s.name}</div>
      <div class="specialRate">${Math.round(s.rate)}%</div>
    </div>
  `).join("");
  const stages = {};

data.forEach(d=>{
  if(!stages[d.stage]){
    stages[d.stage] = {total:0, win:0};
  }

  stages[d.stage].total++;

  if(d.result.includes("成功")){
    stages[d.stage].win++;
  }
});

const stageList = Object.keys(stages).map(s=>{
  const st = stages[s];
  return {
    name: s,
    rate: (st.win / st.total) * 100
  };
});

/* 成功率順 */
stageList.sort((a,b)=>b.rate - a.rate);

/* 表示 */
document.getElementById("stageRank").innerHTML =
  stageList.map(s=>`
    <div class="rankItem">
      <div class="rankName">${s.name}</div>
      <div class="rankRate">${Math.round(s.rate)}%</div>
    </div>
  `).join("");
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
    
    <!-- ←左上戻るボタン（これだけ残す） -->
<button onclick="closeDetail()" style="
  position:sticky;
  top:0;

  background:#2b3a66; /* 青×紺 */
  color:#fff;

  border:none;
  border-radius:12px;

  font-size:18px;      /* ←ここ大きく */
  font-weight:900;

  padding:10px 16px;  /* ←ここ大きく */

  width:auto;
  display:inline-block;

  margin-bottom:12px;
">
  ← 戻る
</button>

    <div style="line-height:1.8;padding-top:10px;">

      <b>ステージ：</b>${d.stage}<br>
      <b>結果：</b>${d.result}<br>
      <b>スペシャル：</b>${d.special}<br><br>

      <b>金イクラ：</b>${d.gold}<br>
      <b>アシスト：</b>${d.goldA}<br>
      <b>赤イクラ：</b>${d.red}<br>

    </div>
  `;

  detail.classList.add("active");
}
function closeDetail(){
  document.getElementById("detail").classList.remove("active");
}
