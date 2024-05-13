const app = require("express")();

app.get('/', (req, res) => {
    res.send("thanks");
  })

app.post('/login', (req, res) => {
  res.send('logged in');
});

app.post('/register', (req, res) => {
  console.log('registered');
  
  res.send('registered');
});

app.listen(3000, () => console.log("app running"));