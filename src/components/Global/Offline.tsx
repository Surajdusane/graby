import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import HeaderLogo from "./HeaderLogo";
import { Illustration } from "./Illustration";

const Offline = () => {
  return (
    <Card className="min-w-[450px] min-h-[450px]">
      <CardHeader>
        <HeaderLogo />
        <CardTitle className="text-2xl font-bold ">
        </CardTitle>
      </CardHeader>
      <CardContent className="font-pop min-h-full">
        <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
          <Illustration
            className="absolute left-0 top-0 -translate-x-1/2"
            aria-hidden="true"
          />
          <Illustration
            className="absolute bottom-0 right-0 translate-x-1/4"
            aria-hidden="true"
          />
          <h1 className="text-lg font-medium text-center">
           You are offline Please check your internet connection.
          </h1>
        </div>
        <img src={"offline.svg"} alt="offline" className="w-2/3 mt-20 mx-auto animate-ping" />
      </CardContent>
    </Card>
  );
};

export default Offline;
