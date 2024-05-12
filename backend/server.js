const app = require("express")();

app.get('/', (req, res) => {
    res.send("thanks");
  } 
)

app.listen(3000, () => console.log("app running"));