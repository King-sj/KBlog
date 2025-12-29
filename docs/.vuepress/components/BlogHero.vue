<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import HitokotoBlogHero from "vuepress-theme-hope/presets/HitokotoBlogHero.js";
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
</script>

<template>
  <Blog>
    <template #heroBg>
        <BingHeroBackground></BingHeroBackground>
    </template>
    <template #heroInfo="data">
      <HitokotoBlogHero v-bind="data" />
    </template>
  </Blog>
</template>