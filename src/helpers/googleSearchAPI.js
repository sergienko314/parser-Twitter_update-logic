const google = require("googlethis");

const getGoogleSerch = async (name) => {
  // console.log({ nikNAmeInGoogleFirst: name });
  const options = {
    page: 0,
    safe: false, // Safe Search
    parse_ads: false, // If set to true sponsored results will be parsed
    additional_params: {
      hl: "en",
    },
  };

  const response = await google.search(
    `twitter официальный канал ${name}`,
    options
  );
  // console.log({ "response.results[0]": response.results[0].url });

  if (!response.results[0]) {
    return " ";
  }
  if (
    response.results[0].url?.split("/").includes("twitter.com") ||
    response.results[0].url?.split("/").includes("mobile.twitter.com")
  ) {
    const urlArray = response.results[0].url.split("/");
    const urlArrayTwo = urlArray[urlArray.length - 1].split("?");
    const nikName = urlArrayTwo[0];
    // console.log({ returnNikName: nikName });
    return nikName;
  } else {
    const secondResults = await google.search(`твиттер ${name}`, options);
    // console.log({ "response.results[0]": secondResults.results[0].url });

    if (!secondResults.results[0]) {
      return " ";
    }
    if (
      secondResults.results[0].url?.split("/").includes("twitter.com") ||
      secondResults.results[0].url?.split("/").includes("mobile.twitter.com")
    ) {
      const urlArray = secondResults.results[0].url.split("/");
      const urlArrayTwo = urlArray[urlArray.length - 1].split("?");
      const nikName = urlArrayTwo[0];
      // console.log({ returnNikName: nikName });
      return nikName;
    }
  }

  return " ";
};
module.exports = { getGoogleSerch };
