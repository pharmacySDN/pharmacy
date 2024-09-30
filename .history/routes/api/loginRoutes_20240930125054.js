router.get('/login', (req, res) => {
    res.render('users/login', { error: null });
  });
  
  router.post('/login', userController.login);
  router.get('/logout', userController.logout);
  