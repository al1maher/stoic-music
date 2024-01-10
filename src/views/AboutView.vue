<template>
  <div
    class="container mx-auto p-4 md:p-8 flex flex-wrap lg:items-center flex-col-reverse lg:flex-row my-text"
  >
    <!-- Text Div -->
    <div class="lg:w-8/12 pr-4 mt-8 lg:mt-0 text-center lg:text-start">
      <h1 class="text-yellow-500 font-bold text-3xl mb-4">{{ $t('about.main') }}</h1>
      <p class="text-gray-700 mb-4 text-lg leading-loose">{{ $t('about.p1') }}</p>
      <p class="text-gray-700 mb-4 text-lg leading-loose">{{ $t('about.p2') }}</p>
      <p class="text-gray-700 mb-4 text-lg leading-loose">{{ $t('about.p3') }}</p>
    </div>

    <!-- Image Div -->
    <div class="lg:w-4/12">
      <img src="/assets/img/about.png" alt="About Stoic Music" class="w-full h-auto max-w-full" />
    </div>
  </div>
  <!--Contact Info-->
  <div class="container mx-auto px-4 lg:px-8 flex items-center justify-center">
    <a
      href="https://www.linkedin.com/in/al1maher"
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-700 mx-2 md:mx-4"
    >
      <i class="fab fa-linkedin fa-2x"></i>
    </a>
    <a
      href="https://github.com/al1maher"
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-700 mx-2 md:mx-4"
    >
      <i class="fab fa-github fa-2x"></i>
    </a>
    <a
      href="https://twitter.com/al1maher"
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-700 mx-2 md:mx-4"
    >
      <i class="fab fa-twitter fa-2x"></i>
    </a>
    <a href="mailto:ali.maher.2906@gmail.com" class="text-gray-700 mx-2 md:mx-4">
      <i class="fas fa-envelope fa-2x"></i>
    </a>
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .my-text {
    text-wrap: balance;
  }
}

.my-text h1 {
  font-size: 2rem;
}

.my-text p {
  line-height: 1.5;
}

.my-text a {
  transition: color 0.3s ease;
}

.my-text a:hover {
  color: #4a5568;
}
</style>
