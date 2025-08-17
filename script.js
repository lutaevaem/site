
(function(){
  const params = new URLSearchParams(location.search);
  const utm = {
    utm_source: params.get('utm_source') || 'site',
    utm_medium: params.get('utm_medium') || 'web',
    utm_campaign: params.get('utm_campaign') || 'default',
    utm_content: params.get('utm_content') || ''
  };
  document.querySelectorAll('form[data-utm-capture="true"]').forEach(form=>{
    ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(k=>{
      const input = form.querySelector(`input[name="${k}"]`);
      if(input){ input.value = utm[k] }
    });
  });
})();
