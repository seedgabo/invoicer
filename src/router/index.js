import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import {
  api
} from '../api';
Vue.use(Router);


var router = new Router({
  routes: [{
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  console.log({
    from: from,
    to: to
  });
  await api.ready
  if (to.path == "/login" || api.user) return next();
  next({
    path: "/login",
    replace: true
  });
});

export default router;
