interface PostData {
  date?: number | string;
  id?: string;
  code?: string;
  media_type?: string;
  caption?: string;
  views?: number;
  comments?: number;
  likes?: number;
  duration?: number;
  url?: string;
  download_url?: string[];
}

const handleFileDownload = async (
  response: PostData[],
  fileType: 'JSON' | 'CSV',
  username: string
): Promise<void> => {
  try {
    // Validate input data
    if (!response || !Array.isArray(response) || response.length === 0) {
      throw new Error("Invalid or empty response from background script");
    }

    const data = response;

    // Function to convert JSON to CSV format
    const jsonToCsv = (jsonData: PostData[]): string => {
      // Extract headers dynamically from the first object
      const headers = Object.keys(jsonData[0]) as (keyof PostData)[];
      // Create the header row
      const headerRow = headers.join(',');

      // Create rows by mapping each item in jsonData
      const rows = jsonData.map((item) =>
        headers
          .map((header) => {
            if (header === 'download_url') {
              // Ensure download_url is always an array before joining
              const urls = Array.isArray(item[header]) ? item[header] : [];
              return `"${urls.join(';')}"`;
            }
            // Wrap all other values in double quotes to handle special characters
            return `"${String(item[header]).replace(/"/g, '""')}"`;
          })
          .join(',')
      );

      // Combine header and rows into a single CSV string
      return [headerRow, ...rows].join('\n');
    };

    let blob: Blob;

    // Generate file based on the specified fileType
    if (fileType === 'JSON') {
      // Convert JSON data to a Blob
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    } else if (fileType === 'CSV') {
      // Convert JSON data to CSV format and create a Blob
        const refinedata = data.map((item: PostData) => {
          const newItem = { ...item }; // Create a shallow copy of the item
        
          // Convert seconds to milliseconds if the timestamp is in seconds
          if (item.date) {
            const dateInMilliseconds = Number(newItem.date) * 1000;
        
          // Format the date
          newItem.date = new Date(dateInMilliseconds).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',  // Include hour
            minute: '2-digit', // Include minute
            second: '2-digit', // Include second
            hour12: true, // Use 12-hour format (AM/PM)
          });
          }
        
          return newItem;
        });
      
      const csvData = jsonToCsv(refinedata);
      blob = new Blob([csvData], { type: 'text/csv' });
    } else {
      throw new Error('Invalid file type specified. Supported types are "JSON" and "CSV".');
    }

    // Create a download link for the file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}.${fileType.toLowerCase()}`; // Use the username and file type for the filename
    link.style.display = 'none'; // Hide the link element

    // Append link to body, trigger the download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free memory
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export default handleFileDownload;