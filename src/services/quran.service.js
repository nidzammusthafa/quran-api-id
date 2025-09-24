const httpStatus = require("http-status");
const quran = require("../data/quran.json");
const ApiError = require("../utils/ApiError");
const { getRandomInt } = require("../utils/utility");

const getListSurahs = () => {
  return quran.map(({ ayahs, bismillah, ...rest }) => rest);
};

const getSurah = (surahNumber) => {
  const surah = quran[Number(surahNumber) - 1];

  if (!surah) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return surah;
};

const getAyahs = (surahNumber) => {
  const ayahs = quran[Number(surahNumber) - 1]?.ayahs;

  if (!ayahs) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return ayahs;
};

const getAyah = (surahNumber, ayahNumber) => {
  const ayah = quran[Number(surahNumber) - 1]?.ayahs[Number(ayahNumber) - 1];

  if (!ayah) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return ayah;
};

const getRandomSurah = () => {
  const surah = quran[getRandomInt(1, 114) - 1];
  return surah.ayahs[getRandomInt(1, surah.ayahs.length) - 1];
};

const getJuz = (juzNumber) => {
  const ayahsInJuz = [];
  quran.forEach(surah => {
    const ayahs = surah.ayahs.filter(ayah => ayah.meta.juz === Number(juzNumber));
    if (ayahs.length > 0) {
      ayahsInJuz.push({
        number: surah.number,
        name: surah.name,
        translation: surah.translation,
        revelation: surah.revelation,
        numberOfAyahs: surah.numberOfAyahs,
        ayahs: ayahs
      });
    }
  });

  if (ayahsInJuz.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return ayahsInJuz;
};

const getPage = (pageNumber) => {
  const ayahsInPage = [];
  quran.forEach(surah => {
    const ayahs = surah.ayahs.filter(ayah => ayah.meta.page === Number(pageNumber));
    if (ayahs.length > 0) {
      ayahsInPage.push({
        number: surah.number,
        name: surah.name,
        translation: surah.translation,
        revelation: surah.revelation,
        numberOfAyahs: surah.numberOfAyahs,
        ayahs: ayahs
      });
    }
  });

  if (ayahsInPage.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return ayahsInPage;
};

const search = (keyword) => {
  const result = [];
  const lowerCaseKeyword = keyword.toLowerCase();

  quran.forEach(surah => {
    const matchingAyahs = surah.ayahs.filter(ayah => 
      ayah.arab.includes(keyword) || 
      ayah.translation.toLowerCase().includes(lowerCaseKeyword)
    );

    if (matchingAyahs.length > 0) {
      result.push({
        number: surah.number,
        name: surah.name,
        translation: surah.translation,
        revelation: surah.revelation,
        numberOfAyahs: surah.numberOfAyahs,
        matches: matchingAyahs.map(ayah => ({
          number: ayah.number,
          arab: ayah.arab,
          translation: ayah.translation
        }))
      });
    }
  });

  if (result.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "not found");
  }

  return result;
};

module.exports = { getListSurahs, getSurah, getAyahs, getAyah, getRandomSurah, getJuz, getPage, search };
