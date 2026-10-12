(function(){
  var toggle=document.getElementById('nav-toggle');
  var nav=document.getElementById('nav-links');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'×':'☰';
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';});});
  }
  var year=document.getElementById('current-year');
  if(year)year.textContent=String(new Date().getFullYear());
})();