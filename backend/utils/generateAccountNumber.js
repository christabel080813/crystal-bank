const generateAccountNumber = () => {
  const accountNumber = Math.floor(
    1000000000 + Math.random() * 9000000000
  );

  return accountNumber.toString();
};

export default generateAccountNumber;