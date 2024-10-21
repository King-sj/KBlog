import { defineClientConfig } from 'vuepress/client'
import IndexLayout from './layouts/IndexLayout.vue'
import "vuepress-theme-hope/presets/shinning-feature-panel.scss"
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
export default defineClientConfig({
  layouts: {
    IndexLayout
  },
  setup() {
    setupRunningTimeFooter(
      new Date("2024-05-08"),
      {
        "/": "Running time: :day days :hour hours :minute minutes :second seconds",
        "/zh/": "已运行 :day 天 :hour 小时 :minute 分钟 :second 秒",
      },
      true,
    );
    // setupTransparentNavbar({ type: "homepage" });
  },
})