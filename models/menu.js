const Menu = {
  id: {
    type: String,
    require: false,
  },
  nomePiatto: {
    type: String,
    required: true,
  },
  prezzo: {
    type: String,
    required: true,
    unique: true,
  },
};

module.exports = Menu;
