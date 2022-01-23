export const getLocationPromisified = () => {
  const promise = new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (success) => {
        resolve(success.coords);
      },
      (error) => {
        reject(error);
      }
    )
  );
  return promise;
};
