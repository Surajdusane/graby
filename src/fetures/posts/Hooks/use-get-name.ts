interface NamingSchema {
    code: boolean
    comments: boolean
    date: boolean
    duration: boolean
    id: boolean
    likes: boolean
    views: boolean
}

export const getDefaulNameSchema = () : NamingSchema => ({
        "code": true,
        "comments": false,
        "date": false,
        "duration": false,
        "id": false,
        "likes": false,
        "views": false
  });

const usegetName = async () : Promise<NamingSchema> => {
    try {
        const storedFilters = await chrome.storage.local.get("namingSchema");
        const namingSchema = storedFilters.namingSchema;
        if (namingSchema) {
          return {
            ...getDefaulNameSchema(),
            ...namingSchema, // Spread actual filter data here
          };
        }
        return getDefaulNameSchema();
      } catch (error) {
        console.error("Error retrieving filter parameters:", error);
        return getDefaulNameSchema();
      }
}

export default usegetName;