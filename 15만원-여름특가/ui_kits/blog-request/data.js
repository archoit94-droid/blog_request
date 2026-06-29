// Mock backend for the Blog Request UI kit demo.
// Mirrors the Apps Script endpoints used in production (server.js / serverApi.js).

(function () {
  const reservedKeywords = ['강남고시원', '서초고시원', '마포원룸'];
  const submittedPlaces = new Set(['8888', '9999']);

  function delay(ms, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  window.GobangAPI = {
    checkAccess() {
      return delay(400, {
        ok: true,
        startDate: '2026-04-01',
        endDate: '2026-04-30',
        maxCount: 100,
        currentCount: 88,
      });
    },

    fetchPlaceInfo(url) {
      return delay(700, {
        ogTitle: '강남역 도보 5분 · 신축 프리미엄 고시원',
        ogDesc: '풀옵션 1인실 · 24시간 운영 · 무료 조식 제공. 청결과 보안을 최우선으로 합니다.',
        deposit: '50만원',
        monthly: '45만원',
        walking: '강남역 도보 5분',
      });
    },

    checkPlaceUrl(url) {
      const m = url.match(/\/place\/(\d+)$/);
      const id = m ? m[1] : '';
      return delay(500, { available: !submittedPlaces.has(id) });
    },

    checkKeyword(kw) {
      const norm = kw.replace(/\s+/g, '');
      const taken = reservedKeywords.includes(norm);
      return delay(450, taken
        ? { available: false, remainingDays: 12 }
        : { available: true });
    },

    submitForm(payload) {
      return delay(800, { success: true });
    },
  };
})();
