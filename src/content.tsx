import HeaderLogo from "./components/Global/HeaderLogo";
import ProfileCard from "./fetures/profile/components/ProfileCard";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChromeStorageUtils } from "./lib/cromeUtilsF";
import NotUrl from "./components/Global/NotUrl";
import { isInstagramAccountUrl } from "./lib/utils";
import { useEffect, useState } from "react";
import Data from "./fetures/posts/components/Data";
import Video from "./fetures/posts/components/Video";
import SettingsButton from "./fetures/settings/components/SettingButton";
import SettingsPage from "./fetures/settings/components/Settings";

const ContentPage = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  useEffect(() => {
    const cromeutils = new ChromeStorageUtils();
    cromeutils.getCurrentTabUrl().then((url) => {
      setCurrentUrl(url);
    });
  }, []);

  if(currentUrl){
    if(!isInstagramAccountUrl(currentUrl)) {
      return <NotUrl url={String(currentUrl)} />
    }
  }

  return (
    <Card className="min-w-[440px] min-h-[440px] font-pop">
      <CardHeader >
        <div className="flex justify-between items-center">
        <HeaderLogo />
        <SettingsButton />
        <SettingsPage />
        </div>
      </CardHeader>
      <CardContent>
      <Tabs defaultValue="home">
  <div className="w-full flex justify-center items-center mb-5">
    <TabsList>
      <TabsTrigger value="home">Home</TabsTrigger>
      <TabsTrigger value="data">Data</TabsTrigger>
      <TabsTrigger value="video">Video</TabsTrigger>
    </TabsList>
  </div>
  <TabsContent value="home">
    <ProfileCard />
  </TabsContent>
  <TabsContent value="data">
    <Data />
  </TabsContent>
  <TabsContent value="video">
    <Video />
  </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentPage;
