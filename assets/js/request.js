(function(){
  var form=document.getElementById('service-request-form');
  var mapElement=document.getElementById('project-map');
  var status=document.getElementById('location-status');
  var feedback=document.getElementById('form-feedback');
  var locationPoint=null;
  var map=null;
  var marker=null;
  var submitButton=form?form.querySelector('button[type="submit"]'):null;
  var defaultPoint=[37.5527,45.0761];

  function showPoint(lat,lng){
    locationPoint={lat:Number(lat),lng:Number(lng)};
    if(status){
      status.innerHTML='<strong>موقعیت ثبت‌شده پروژه</strong><span>مختصات و لینک نقشه همراه درخواست ایمیل می‌شود.</span><div class="coords"><span>Lat: '+locationPoint.lat.toFixed(6)+'</span><span>Lng: '+locationPoint.lng.toFixed(6)+'</span></div>';
    }
  }
  function moveMarker(latlng){
    showPoint(latlng.lat,latlng.lng);
    if(marker)marker.setLatLng(latlng);
    else if(map&&window.L)marker=window.L.marker(latlng,{draggable:true}).addTo(map);
    if(marker){
      marker.off('dragend');
      marker.on('dragend',function(e){
        var p=e.target.getLatLng();
        showPoint(p.lat,p.lng);
      });
    }
  }

  if(mapElement&&window.L){
    map=window.L.map(mapElement,{scrollWheelZoom:false}).setView(defaultPoint,12);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);
    map.on('click',function(e){moveMarker(e.latlng);});
    setTimeout(function(){map.invalidateSize();},250);
  }else if(status){
    status.innerHTML='<strong>نقشه بارگذاری نشد</strong><span>اتصال اینترنت را بررسی کنید و صفحه را دوباره بارگذاری کنید.</span>';
  }

  var locate=document.getElementById('use-device-location');
  if(locate)locate.addEventListener('click',function(){
    if(!navigator.geolocation){
      if(feedback)feedback.textContent='مرورگر قابلیت دریافت موقعیت دستگاه را ندارد؛ لطفاً نقطه پروژه را روی نقشه انتخاب کنید.';
      return;
    }
    if(feedback)feedback.textContent='در حال دریافت موقعیت دستگاه؛ در صورت نمایش پیام مرورگر، اجازه دسترسی بدهید.';
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat=pos.coords.latitude,lng=pos.coords.longitude;
      if(map){map.setView([lat,lng],16);moveMarker({lat:lat,lng:lng});}
      else showPoint(lat,lng);
      if(feedback)feedback.textContent='موقعیت دستگاه ثبت شد. اگر محل پروژه متفاوت است، نقطه صحیح پروژه را روی نقشه انتخاب کنید.';
    },function(){
      if(feedback)feedback.textContent='موقعیت دریافت نشد؛ مجوز مرورگر و HTTPS را بررسی کنید یا نقطه را روی نقشه بزنید.';
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  });

  var center=document.getElementById('center-urmia');
  if(center)center.addEventListener('click',function(){if(map)map.setView(defaultPoint,12);});

  function makePayload(values){
    return {
      name:String(values.get('name')||''),
      phone:String(values.get('phone')||''),
      service:String(values.get('service')||''),
      timing:String(values.get('timing')||'قابل هماهنگی'),
      address:String(values.get('address')||''),
      description:String(values.get('description')||''),
      email:String(values.get('email')||''),
      company:String(values.get('company')||''),
      page:window.location.origin+window.location.pathname,
      location:locationPoint?{lat:locationPoint.lat,lng:locationPoint.lng}:null
    };
  }

  if(form)form.addEventListener('submit',async function(event){
    event.preventDefault();
    if(!form.reportValidity())return;

    var payload=makePayload(new FormData(form));
    if(feedback)feedback.textContent='در حال ارسال امن درخواست به ایمیل؛ لطفاً صفحه را نبندید.';
    if(submitButton){submitButton.disabled=true;submitButton.setAttribute('aria-busy','true');}

    try{
      var response=await fetch('/api/request',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload),
        cache:'no-store',
        credentials:'same-origin'
      });
      var result={};
      try{result=await response.json();}catch(_){}
      if(!response.ok||!result.ok){
        var failureMessage=result.message||'ارسال ایمیل موفق نبود.';
        if(result.requestId)failureMessage+=' شناسه پیگیری: '+result.requestId;
        throw new Error(failureMessage);
      }

      if(feedback)feedback.textContent=result.message||'درخواست به سرویس ایمیل ارسال شد.';
      if(locationPoint){
        if(marker&&map)map.removeLayer(marker);
        marker=null;
        locationPoint=null;
        if(status)status.innerHTML='<strong>موقعیت پروژه</strong><span>برای درخواست بعدی، نقطه پروژه را روی نقشه انتخاب کنید.</span><div class="coords"><span>Lat: —</span><span>Lng: —</span></div>';
      }
      form.reset();
    }catch(error){
      if(feedback)feedback.textContent=(error&&error.message?error.message:'ارسال درخواست ناموفق بود.')+' درخواست ارسال نشده است؛ تنظیمات ایمیل باید بررسی شود و سپس دوباره تلاش کنید.';
    }finally{
      if(submitButton){submitButton.disabled=false;submitButton.removeAttribute('aria-busy');}
    }
  });
})();