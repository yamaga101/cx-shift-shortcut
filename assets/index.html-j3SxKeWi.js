const d={swap:{icon:"swap_horiz",cls:"swap",badge:"blue",desc:"2範囲の値を入替え"},unassigned:{icon:"arrow_downward",cls:"unassigned",badge:"green",desc:"シフトを未充当に移動"},finalize:{icon:"check_circle",cls:"finalize",badge:"orange",desc:"確定マーク付与/解除"}};function o(e){const s=[];return e.meta&&s.push(navigator.platform.includes("Mac")?"⌘":"Ctrl"),e.ctrl&&navigator.platform.includes("Mac")&&s.push("⌃"),e.alt&&s.push(navigator.platform.includes("Mac")?"⌥":"Alt"),e.shift&&s.push("⇧"),s.push(e.key.toUpperCase()),s.join("")}async function l(){const e=await new Promise(n=>chrome.runtime.sendMessage({type:"getSettings"},n)),s=document.getElementById("toggle"),c=document.body;e.enabled||(s.classList.remove("on"),c.classList.add("disabled")),s.addEventListener("click",async()=>{e.enabled=!e.enabled,s.classList.toggle("on",e.enabled),c.classList.toggle("disabled",!e.enabled),await chrome.runtime.sendMessage({type:"saveSettings",settings:e})});const i=document.getElementById("shortcutList");i.innerHTML="";for(const n of e.bindings){const t=d[n.id]||{icon:"keyboard",cls:"swap",badge:"blue",desc:""},a=document.createElement("div");a.className="shortcut-card",a.innerHTML=`
      <div class="shortcut-icon ${t.cls}">
        <span class="material-symbols-outlined">${t.icon}</span>
      </div>
      <div class="shortcut-info">
        <div class="shortcut-name">${n.label}</div>
        <div class="shortcut-desc">${t.desc}</div>
      </div>
      <span class="key-badge ${t.badge}">${o(n)}</span>
    `,i.appendChild(a)}document.getElementById("openOptions").addEventListener("click",()=>{chrome.runtime.openOptionsPage()})}l();
