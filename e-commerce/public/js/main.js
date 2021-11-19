$(function(){
   if ($('textarea#ta').length){
       CKEDITOR.replace('ta');
   }
   $('a.deleted').on('click', function(){
       if(!confirm('Supression confirmée'))
           return false;
   });
});