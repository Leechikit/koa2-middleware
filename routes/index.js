var router = require('koa-router')();
//var controller = require('../controllers/index');

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'koa2 title'
  };
  
  //let data = await controller();

  await ctx.render('index', data);
});
module.exports = router;
