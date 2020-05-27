import Vue from "vue";
import VueRouter from "vue-router"
import routes from "./routes"
import store from '../store/index'

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})


export default router;
