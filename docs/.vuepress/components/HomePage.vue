<template>
  <HopeHomePage>
    <!-- 使用 bottom 插槽引入评论组件 -->
    <template #bottom>
    <!-- TODO: it's not work -->
      <CommentService />
    </template>
  </HopeHomePage>
</template>
<script setup lang="ts">
import HopeHomePage from "vuepress-theme-hope/components/HomePage.js";
import { useArticles } from 'vuepress-theme-hope/modules/blog/composables/index.js'

const articles = useArticles()
</script>
