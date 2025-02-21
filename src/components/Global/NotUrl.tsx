import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import HeaderLogo from "./HeaderLogo";
import { Illustration } from "./Illustration";

const NotUrl = ({ url }: { url: string }) => {
  return (
    <Card className="min-w-[450px] min-h-[450px]">
      <CardHeader>
        <HeaderLogo />
        <CardTitle className="text-2xl font-bold ">
          Not a valid Instagram profile URL
        </CardTitle>
      </CardHeader>
      <CardContent className="font-pop">
        <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-6 py-8 sm:px-12 sm:py-10 shadow-lg dark:border dark:border-zinc-700 min-w-[350px]">
          <Illustration
            className="absolute left-0 top-0 -translate-x-1/2"
            aria-hidden="true"
          />
          <Illustration
            className="absolute bottom-0 right-0 translate-x-1/4"
            aria-hidden="true"
          />
          <h1 className="text-lg font-medium">
            <span className="text-rose-600">
            {url.split("/")[2] + " "}
            </span>
            is not a valid Instagram profile URL.
          </h1>
          <br />
          <h2 className="text-lg font-semibold mb-4">Examples</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li className=" hover:underline cursor-pointer">
              instagram.com/username
            </li>
            <li className=" hover:underline cursor-pointer">
              instagram.com/valid_user
            </li>
            <li className=" hover:underline cursor-pointer">
              instagram.com/user.name_123
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotUrl;
