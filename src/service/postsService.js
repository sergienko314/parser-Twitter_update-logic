const { TwitterPostModel } = require("../db/schemas/TwitterPostsModel");
const format = require("date-format");
const { UserTwiterModel } = require("../db/schemas/UserTelegramSchema");
const { getContentPage } = require("./parserPuppeteer");
const { serchModICS, serchModCII } = require("./gpt");
const countPost = 10;
const limitDelete = 10;

const createTwitters = async (array) => {
  const reqNikName = array[0].nikName;
  const FindAllModsUser = await UserTwiterModel.find({}).exec();
  const allModsNikName = FindAllModsUser.map((item) =>
    item.subscriptions.map(({ nikName, mod }) => {
      if (nikName === reqNikName) {
        return mod;
      }
      return;
    })
  );
  const flatModArray = allModsNikName.flat(Infinity).filter(Boolean); // висіпаємо всі значення та фільтруємо undefined
  const uniqueValues = [...new Set(flatModArray)];

  for (let i = 0; i < array?.length; i++) {
    const modICS = await serchModICS(array[i], uniqueValues);

    const modCII = await serchModCII(array[i], uniqueValues);

    if (i < countPost) {
      TwitterPostModel.insertMany({
        timePublic: array[i].timePublic,
        time: array[i].time,

        timeId: new Date(array[i].time).getTime(),
        text: array[i].text,
        video: array[i].video,
        haveRepost: array[i].haveRepost,
        haveRetweete: array[i].haveRetweete,
        img: array[i].img,
        retwite: array[i].retwite,
        repost: array[i].repost,
        textUA: array[i].textUA,
        name: array[i].name,
        nikName: array[i].nikName,
        verification: array[i].verification,
        registrationTime: array[i].registrationInfo,
        foloverInfo: array[i].foloverInfo,
        createdAt: format(`dd-MM-yy hh:mm:ss.${i}0`, new Date()),

        link: array[i].link,

        videoPoster: array[i].videoPoster,
        comentModCII: modCII,
        comentModICS: modICS,
      });
    }
  }
};

const getTwitterByNikName = async (nikName) => {
  const data = await TwitterPostModel.find({ nikName: nikName })
    .sort({ createdAt: -1 })
    .limit(limitDelete)
    .exec();
  if (!data.length) {
    return null;
  }
  return data;
};

const getAllSubsUser = async () => {
  const users = await UserTwiterModel.find().exec();
  const arrayUseruserSubscriptionsAllArrays = users.map((item) =>
    item.subscriptions.map(({ nikName }) => nikName)
  );

  const arrayUseruserSubscriptionsAll =
    arrayUseruserSubscriptionsAllArrays.flat(Infinity);
  const setObjUseruserSubscriptionsAll = new Set(arrayUseruserSubscriptionsAll);
  const setArrayUseruserSubscriptionsAll = [...setObjUseruserSubscriptionsAll];
  return setArrayUseruserSubscriptionsAll;
};

const updateTwitterPostsAuto = async () => {
  console.log("время сейчас", new Date());
  var now = new Date();
  var hour = now.getHours();

  if (hour >= 8 - 3 && hour < 22 - 3) {
    const subsArray = await getAllSubsUser();
    for (let item = 0; item < subsArray.length; item++) {
      const nikName = String(subsArray[item]);
      const allNewPosts = await getContentPage(subsArray[item]);
      const oldTwitterPost = await TwitterPostModel.find({
        nikName: nikName,
      });
      const oldTwitterPostId = await oldTwitterPost?.map((post) => post.time);
      const newPosts = allNewPosts?.filter((post, index) => {
        return !oldTwitterPostId.includes(post.time);
      });
      if (newPosts?.length) {
        await createTwitters(newPosts);
      }
    }
  } else {
    console.log("Зараз нічний час");
  }
  setTimeout(updateTwitterPostsAuto, 120000);
};
updateTwitterPostsAuto();

const delateOldTwitters = async () => {
  const allPosts = await TwitterPostModel.find().exec();
  const allPostsNikName = allPosts.map((post) => post.nikName);
  const uniqueNames = [...new Set(allPostsNikName)];

  return uniqueNames.map(async (item, i) => {
    const TwitterPosts = await TwitterPostModel.find({ nikName: item })
      .sort({ createdAt: -1 })

      .limit(10);
    const yangPostsTimeArray = TwitterPosts.map((post) => post.time);

    const resalt = await TwitterPostModel.deleteMany({
      $and: [
        {
          nikName: item,
        },

        {
          time: {
            $nin: yangPostsTimeArray,
          },
        },
      ],
    });
    console.log("useDaleteFunction - resalt", resalt);
    return resalt;
  });
};

setInterval(delateOldTwitters, 24 * 60 * 60 * 1000);

module.exports = {
  getTwitterByNikName,
  createTwitters,
};
