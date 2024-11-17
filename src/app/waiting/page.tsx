const WaitingPage = () => {
  return (
    <div className="flex flex-col justify-center items-start h-[80vh]">
      <p className="text-lg font-bold">Please wait </p>
      <h1 className="text-6xl font-bold my-3">
        Your account is under <br /> review
      </h1>
      <p className="text-sm">
        If you are facing any issues, please contact support.
      </p>
    </div>
  );
};

export default WaitingPage;
