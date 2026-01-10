export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 'NOT_SUPPORTED' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false, // ✅ IMPORTANT
        timeout: 20000,            // ✅ more realistic
        maximumAge: 5000,          // ✅ allow small cache
      }
    );
  });
};
