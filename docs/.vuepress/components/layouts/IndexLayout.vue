<template>

</template>
<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useArticles } from 'vuepress-theme-hope/blog';
import { usePage } from "vuepress/client"
const articles = useArticles();
const pages = articles.value.items;
const testPages = pages.filter(page => page.path.startsWith('/essays/'));
console.log('testPages', testPages);
</script>
<style lang="scss"></style>
