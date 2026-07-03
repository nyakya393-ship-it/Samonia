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
    p1.innerHTML = `
      <div class="battleCard" style="text-align:center;opacity:.6;">
        戦績がありません
      </div>
    `;
    analyze();
    return;
  }

  p1.innerHTML =
    data.slice().reverse().map(d=>`
      <div class="battleCard">
        <b>${d.stage}</b><br>
        ${d.result}<br>
        ${d.special}<br>
        金:${d.gold} / アシ:${d.goldA} / 赤:${d.red}
        
        <button onclick="remove(${d.id})" style="
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
