let actionmodelsReq = require.context('../controllers/models', true, /\.js$/);
let actionPagesReq = require.context('../controllers/pages', true, /\.js$/);
let actionViewsReq = require.context('../controllers/views', true, /\.js$/);

let controllers = { models: {}, pages: {}, views: {} };

actionmodelsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionmodelsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.models = dfs(controllers.models, 0);
});
actionPagesReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionPagesReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.pages = dfs(controllers.pages, 0);
});
actionViewsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  let pathStr = path.reduce((prev, next) => `${prev}.${next}`);
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = actionViewsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[pathStr], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  controllers.views = dfs(controllers.views, 0);
});

const componentmodelsReq = require.context('../components/models', true, /\.js$/);
const componentViewsReq = require.context('../components/views', true, /\.js$/);
const componentPagesReq = require.context('../components/pages', true, /\.js$/);

let components = { models: {}, pages: {}, views: {} };

componentmodelsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentmodelsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.models = dfs(components.models, 0);
});
componentPagesReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentPagesReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.pages = dfs(components.pages, 0);
});
componentViewsReq.keys().forEach(key => {
  let path = /^\.+\/(.*)\.js$/.exec(key)[1].split('/');
  const dfs = (obj, pos) => {
    if (pos + 1 === path.length) obj[path[pos]] = componentViewsReq(key).default;
    else {
      if (obj[path[pos]]) obj[path[pos]] = dfs(obj[path[pos]], pos + 1);
      else obj[path[pos]] = dfs({}, pos + 1);
    }
    return obj;
  }
  components.views = dfs(components.views, 0);
});

export { controllers, components };
