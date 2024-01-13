const CoolH1 = ({text} : {text : string}) => {
  const lastLetter = text[text.length - 1];
  return (
    <h1 className="coolBorder p-2 text-center text-2xl">
      <span className="coolText font-bold">
        {/*  */}
        <span className="tracking-[0.8rem]">{text.slice(0, text.length-1)}</span>
        <span>{lastLetter}</span>
      </span>
    </h1>
  );
}

export { CoolH1 };