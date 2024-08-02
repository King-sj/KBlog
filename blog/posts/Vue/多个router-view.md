---
tags:
  - 前端
  - Vue
---

# 多个router-view

单个 <router-view/> 和多个 <router-view/> 的区别，
单个 <router-view/> 只是一个区域的变化，不需要设置name属性，在设置路由的时候单个<router-view/>使用的是component，

多个<router-view/>里面需要设置一个name属性，设置路由的时候单个<router-view/>使用的是components，
————————————————

<div>
　　<router-view/>
　　<router-view class="left" name="nav" />
　　<router-view class="right" name="con" />
</div>



然后在router.js中进行配置，注意：component改成要components，components是一个对象了，nav:AboutNav,左侧的nav就是<router-view name="nav" /> 标签里的 name属性值，nav:AboutNav,右侧的AboutNav就是引用组件时候import AboutNav from './views/AboutNav.vue'中的AboutNav。

import AboutCon from './views/AboutCon.vue'
import AboutNav from './views/AboutNav.vue'

{
　　path: '/about',
　　name: 'about',
　　components:

　　 {
　　nav:AboutNav,
　　con:AboutCon
　　}
}