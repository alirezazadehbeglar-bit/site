(function(){
  var form=document.getElementById('service-request-form');
  var mapElement=document.getElementById('project-map');
  var status=document.getElementById('location-status');
  var feedback=document.getElementById('form-feedback');
  var locationPoint=null;
  var map=null;
  var marker=null;
  var defaultPoint=[37.5527,45.0761];
  function showPoint(lat,lng){
    locationPoint={lat:Number(lat),lng:Number(lng)};
    if(status){
      status.innerHTML='<strong>موقعیت ثبت‌شده پروژه</strong><span>این مختصات همراه درخواست در متن واتساپ درج می‌شود.</span><div class="coords"><span>Lat: '+locationPoint.lat.toFixed(6)+'</span><span>Lng: '+locationPoint.lng.toFixed(6)+'</span></div>';
    }
  }
  function moveMarker(latlng){
    showPoint(latlng.lat,latlng.lng);
    if(marker)marker.setLatLng(latlng);
    else if(map&&window.L)marker=window.L.marker(latlng,{draggable:true}).addTo(map);
    if(marker){marker.off('dragend');marker.on('dragend',function(e){var p=e.target.getLatLng();showPoint(p.lat,p.lng);});}
  }
  if(mapElement&&window.L){
    map=window.L.map(mapElement,{scrollWheelZoom:false}).setView(defaultPoint,12);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
    map.on('click',function(e){moveMarker(e.latlng);});
    setTimeout(function(){map.invalidateSize();},250);
  } else if(status){
    status.innerHTML='<strong>نقشه بارگذاری نشد</strong><span>لطفاً اتصال اینترنت را بررسی کنید و دوباره تلاش کنید. اگر مختصات را دارید، می‌توانید پس از رفع مشکل از نقشه استفاده کنید.</span>';
  }
  var locate=document.getElementById('use-device-location');
  if(locate)locate.addEventListener('click',function(){
    if(!navigator.geolocation){if(feedback)feedback.textContent='مرورگر شما قابلیت دریافت موقعیت دستگاه را ندارد؛ لطفاً روی نقشه نقطه را انتخاب کنید.';return;}
    if(feedback)feedback.textContent='در حال دریافت موقعیت دستگاه؛ اگر مرورگر پرسید، اجازه دسترسی بدهید.';
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat=pos.coords.latitude,lng=pos.coords.longitude;
      if(map){map.setView([lat,lng],16);moveMarker({lat:lat,lng:lng});}
      else showPoint(lat,lng);
      if(feedback)feedback.textContent='موقعیت دستگاه ثبت شد. توجه کنید که اگر محل پروژه متفاوت است، نقطه صحیح پروژه را روی نقشه انتخاب کنید.';
    },function(){
      if(feedback)feedback.textContent='موقعیت دستگاه دریافت نشد. مجوز مرورگر و HTTPS را بررسی کنید یا نقطه را روی نقشه بزنید.';
    },{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  });
  var center=document.getElementById('center-urmia');
  if(center)center.addEventListener('click',function(){if(map)map.setView(defaultPoint,12);});
  if(form)form.addEventListener('submit',function(event){
    event.preventDefault();
    if(!form.reportValidity())return;
    var values=new FormData(form);
    var lines=[
      'سلام، درخواست خدمات جدید از وب‌سایت علی رضازاده بگلر دارم.',
      '',
      'نام: '+(values.get('name')||'—'),
      'شماره تماس: '+(values.get('phone')||'—'),
      'نوع خدمت: '+(values.get('service')||'—'),
      'زمان‌بندی: '+(values.get('timing')||'قابل هماهنگی'),
      'نشانی/محدوده: '+(values.get('address')||'ذکر نشده'),
      'توضیحات پروژه: '+(values.get('description')||'—'),
      'ایمیل/راه ارتباطی: '+(values.get('email')||'ذکر نشده')
    ];
    if(locationPoint){
      lines.push('مختصات پروژه: '+locationPoint.lat.toFixed(6)+', '+locationPoint.lng.toFixed(6));
      lines.push('لینک نقشه: https://www.google.com/maps?q='+locationPoint.lat.toFixed(6)+','+locationPoint.lng.toFixed(6));
      lines.push('OpenStreetMap: https://www.openstreetmap.org/?mlat='+locationPoint.lat.toFixed(6)+'&mlon='+locationPoint.lng.toFixed(6)+'#map=17/'+locationPoint.lat.toFixed(6)+'/'+locationPoint.lng.toFixed(6));
    } else {
      lines.push('موقعیت پروژه روی نقشه انتخاب نشده است.');
    }
    lines.push('محدوده خدمات میدانی: ارومیه و آذربایجان غربی');
    var url='https://wa.me/989140884403?text='+encodeURIComponent(lines.join('\n'));
    if(feedback)feedback.textContent='در حال باز کردن واتساپ با متن درخواست. برای نهایی‌شدن، لطفاً پیام را در واتساپ ارسال کنید.';
    window.location.href=url;
  });
})();