const burgerMenu=()=>{var e=document.querySelector(".burger"),t=document.querySelector(".header__navigation"),r=document.querySelector(".overlay");const a=[e,t,r];t=()=>a.forEach(e=>e.classList.toggle("active"));e.addEventListener("click",t),r.addEventListener("click",t),window.addEventListener("resize",()=>{var e=window["innerWidth"];991.98<e&&a.forEach(e=>e.classList.remove("active"))})},dropdownInit=(burgerMenu(),()=>{var e=document.querySelectorAll("[data-dropdown]");992.98<window.innerWidth?(document.addEventListener("click",e=>{let t;e.target.closest("[data-dropdown]")&&(t=e.target.closest("[data-dropdown]")).classList.toggle("active"),document.querySelectorAll("[data-dropdown].active").forEach(e=>{e!==t&&e.classList.remove("active")})}),e.forEach(e=>{e.addEventListener("mouseover",()=>{e.classList.add("active")}),e.addEventListener("mouseleave",()=>{e.classList.remove("active")})})):e.forEach(t=>{t.addEventListener("click",()=>{var e=t.querySelector(".sub-menu");e.style.maxHeight?e.style.maxHeight="":(document.querySelectorAll(".sub-menu").forEach(e=>{e.style.maxHeight=""}),e.style.maxHeight=e.scrollHeight+"px")})})});dropdownInit();