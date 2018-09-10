/**
 * GET /
 */
module.exports = {
  index : (req, res) => {
  res.render('home', {
    title: 'Home'
  });
},
themeGet : (req, res) => {
  res.render('theme', {
    title: 'Theme'
  });
}

};
