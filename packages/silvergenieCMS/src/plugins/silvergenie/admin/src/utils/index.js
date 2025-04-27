export const openUrl = (url, target = undefined, features = undefined) => {
  const newWindow = window.open(url, target, features);
  if (newWindow) newWindow.opener = null;
};
