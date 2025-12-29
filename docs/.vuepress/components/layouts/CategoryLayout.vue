<template>
  <Blog>
    <template #default="props">
      <div class="category-layout">
        <!-- <div id="head" class="hero">
          <HitokotoBlogHero />
          <BingHeroBackground />
        </div> -->

        <main class="article-list-wrap">
          <ArticleList :items="themeItems" v-bind="props" />
        </main>
      </div>
    </template>
  </Blog>
</template>

<script setup>
import HitokotoBlogHero from "vuepress-theme-hope/presets/HitokotoBlogHero.js";
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useArticles } from 'vuepress-theme-hope/blog';
import {ArticleList} from "vuepress-theme-hope/blog"
import {Blog} from "vuepress-theme-hope/blog"

const route = useRoute();
const articles = useArticles();
// derive base path from current route, e.g. '/tech/' or '/essays/'
const basePath = computed(() => {
  const seg = route.path.split('/').filter(Boolean);
  return seg.length ? `/${seg[0]}/` : '/';
});

const items = computed(() => articles.value?.items || []);
const filtered = computed(() => items.value.filter(p => p.path && p.path.startsWith(basePath.value)));
// remove basePath/index.html from the list
filtered.value.splice(filtered.value.findIndex(p => p.path === `${basePath.value}index.html`), 1);

// Map pages to theme ArticleList item shape: { info, path }
const themeItems = computed(() => filtered.value.map((p) => {
  const info = p.info
  return { info, path: p.path };
}));


</script>

<style lang="sass" scoped>
.category-layout
  max-width: 1200px
  margin: 0 auto
  padding: 16px

#head
  position: relative
  display: flex
  gap: 20px
  align-items: center
  justify-content: space-between
  flex-wrap: wrap
  padding: 24px 0
  min-height: 220px

.hero > *
  position: relative
  z-index: 1

.article-list-wrap
  display: block
  margin-top: 28px
  position: relative
  z-index: 2

@media (max-width: 768px)
  #head
    padding: 16px 0
    gap: 12px
    min-height: 160px
</style>