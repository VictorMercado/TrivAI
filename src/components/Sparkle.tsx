type SparkleProps = {
  children: React.ReactNode;
}

const Sparkle = ({children} : SparkleProps) => {

  return (
    <div className="relative">
      <svg
        className=" absolute left-[-20px] top-[-20px] z-10"
        id="one"
        width="55"
        height="55"
        viewBox="0 0 150 50"
      >
        <g id="copy-1" className="translate-x-[45px] translate-y-[45px]">
          <g className="large animate-sparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              id="path1"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="gold"
            />
          </g>
          <g className="large-2 animate-reverseSparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="cyan"
            />
          </g>
          <g className="small animate-sparkle">
            <path
              className="translate-x-[-60.50px] translate-y-[-60.50px]"
              id="small"
              d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z"
              fill="white"
            />
          </g>
        </g>
      </svg>
      <svg
        className=" absolute left-[110px] top-[-40px] z-10"
        id="one"
        width="55"
        height="55"
        viewBox="0 0 150 50"
      >
        <g id="copy-1" className="translate-x-[45px] translate-y-[45px]">
          <g className="large animate-sparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              id="large"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="gold"
            />
          </g>
          <g className="large-2 animate-reverseSparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              id="large"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="cyan"
            />
          </g>
          <g className="small animate-sparkle">
            <path
              className="translate-x-[-60.50px] translate-y-[-60.50px]"
              id="small"
              d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z"
              fill="white"
            />
          </g>
        </g>
      </svg>
      <svg
        className=" absolute bottom-[-10px] right-[-15px] z-10"
        id="one"
        width="55"
        height="55"
        viewBox="0 0 150 50"
      >
        <g id="copy-1" className="translate-x-[45px] translate-y-[45px]">
          <g className="large animate-sparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              id="large"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="gold"
            />
          </g>
          <g className="large-2 animate-reverseSparkle">
            <path
              className="translate-x-[-42.50px] translate-y-[-42.50px]"
              id="large"
              d="M41.25,40 L42.5,10 L43.75,40 L45,41.25 L75,42.5 L45,43.75 L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z"
              fill="green"
            />
          </g>
          <g className="small animate-sparkle">
            <path
              className="translate-x-[-60.50px] translate-y-[-60.50px]"
              id="small"
              d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75 L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z"
              fill="pink"
            />
          </g>
        </g>
      </svg>
      <div className="animate-blob absolute h-full w-full rounded-lg bg-[#f4b709] opacity-50 mix-blend-multiply blur-xl filter"></div>
      <div className="relative">{children}</div>
    </div>
  );
}

export { Sparkle };