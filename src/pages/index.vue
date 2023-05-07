<script setup >

</script>
<template>
  <nav class=" bg-primary h-[50px] grid grid-cols-5 lg:px-5">
   <div class="h-[50px] flex justify-start items-center" >
<router-link to="login">
  <Btn> <VIcon  class="text-white">mdi-login</VIcon> <span class="text-white">تسجبل الدخول</span> </Btn>
</router-link>

   </div>
   <div class="col-span-3 h-[50px] flex justify-center items-center">

    <ul class="flex justify-center items-center gap-5">
      <li ><a class="text-white hover:text-secondary " href="">الرئيسية</a></li>
      <li><a  class="text-white hover:text-secondary " href="">من نحن</a></li>
      <li><a  class="text-white hover:text-secondary " href="">الخدمات</a></li>
      <li><a  class="text-white hover:text-secondary " href="">الاسئلة الشائعة</a></li>
      <li><a  class="text-white hover:text-secondary " href="">تواصل معنا</a></li>

    </ul>
   </div>
   <div class="h-[50px] justify-end items-center flex ">
<h1 class="text-white">
  logo

</h1>
   </div>
  </nav>
  <div>hi</div>
</template>


<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: false
</route>
