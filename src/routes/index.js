const express = require("express");
const homeRoute = require("./home.route");
const randomRoute = require("./random.route");
const surahsRoute = require("./surahs.route");
const juzRoute = require("./juz.route");
const pageRoute = require("./page.route");

const router = express.Router();

const routes = [
  {
    path: "/",
    route: homeRoute,
  },
  {
    path: "/surahs",
    route: surahsRoute,
  },
  {
    path: "/random",
    route: randomRoute,
  },
  {
    path: "/juz",
    route: juzRoute,
  },
  {
    path: "/pages",
    route: pageRoute,
  },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

module.exports = router;
