export class HeadersUtils {
  async getUserDataHeaders(cookies) {
    // Step 1: Construct cookie string
    const cookieString = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Step 2: Define headers
    const headers = {
      accept: "*/*",
      "accept-language":
        "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,mr-IN;q=0.6,mr;q=0.5",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "none",
      "x-asbd-id": "129477",
      "x-csrftoken": cookies.find((c) => c.name === "csrftoken")?.value || "",
      "x-ig-app-id": "936619743392459",
      "x-ig-www-claim":
        cookies.find((c) => c.name === "x-ig-www-claim")?.value || "",
      cookie: cookieString,
    };

    return headers;
  }
}
