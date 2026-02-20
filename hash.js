const bcrypt = require("bcrypt");

bcrypt.hash("root", 10).then(hash => {
  console.log(hash);
});