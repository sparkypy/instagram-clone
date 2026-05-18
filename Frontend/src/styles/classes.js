export const inputStyles = `
  rounded-2xl
  border border-white/10
  bg-white/5
  px-3 py-2
  sm:px-4 sm:py-3
  text-sm sm:text-base
  text-white
  outline-none
  transition-all
  duration-300
  placeholder:text-zinc-500
  focus:border-purple-500
  focus:bg-white/10
  focus:shadow-[0_0_30px_rgba(168,85,247,0.35)]
`;

export const labelStyles = `
  text-xs sm:text-sm
  text-zinc-300
`;

export const errorStyles = `
  text-[10px] sm:text-xs
  text-fuchsia-400
  break-words
`;

export const buttonStyles = `
  mt-4
  rounded-2xl
  bg-linear-to-r
  from-purple-600
  to-fuchsia-600
  px-3 py-2
  sm:px-5 sm:py-4
  text-sm sm:text-lg
  font-semibold
  tracking-wide
  transition-all
  duration-300

  hover:scale-[1.02]
  hover:shadow-[0_0_35px_rgba(192,132,252,0.45)]

  active:scale-[0.98]

  disabled:cursor-not-allowed
  disabled:opacity-50
  disabled:hover:scale-100
  disabled:hover:shadow-none
`;
