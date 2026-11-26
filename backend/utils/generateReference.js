const generateReference = () => {
  const reference =
    "CB" + Date.now() + Math.floor(Math.random() * 1000);

  return reference;
};

export default generateReference;