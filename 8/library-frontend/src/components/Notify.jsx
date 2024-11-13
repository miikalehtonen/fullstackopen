const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }

  return <div style={{ color: "red", margin: "1em 0" }}>{errorMessage}</div>;
};

export default Notify;
