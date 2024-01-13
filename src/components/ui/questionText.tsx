const QuestionText = ({ text }: { text: string }) => {
  return (
    <h1 className="m-4 px-4 text-center text-3xl">
      <b>{text}</b>
    </h1>
  );
};

export { QuestionText };
