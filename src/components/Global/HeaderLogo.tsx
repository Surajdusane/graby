const HeaderLogo = () => {
  return (
    <div className="flex justify-start items-center">
        <div className="flex justify-center items-center gap-2">
      <img src="/logoblack.svg" alt="Instagram Logo" className="size-8 dark:hidden" />
      <img src="/logowhite.svg" alt="Instagram Logo" className="size-8 hidden dark:block" />
      <h1 className="text-xl font-bold uppercase font-mon">Graby</h1>
    </div>
    </div>
  );
};

export default HeaderLogo;
