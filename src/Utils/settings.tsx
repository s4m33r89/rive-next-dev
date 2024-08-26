export const getSettings = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const values = localStorage.getItem("RiveStreamSettings");
    return values ? JSON.parse(values) : null;
  }
  return null;
};

export const setSettings = ({ values }: any) => {
  // var values = getSettings() || {
  //   theme: "", mode: "", ascent_color: ""
  // };
  // values[type] = value;
  localStorage.setItem("RiveStreamSettings", JSON.stringify(values));
};
