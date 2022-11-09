const capitaliseFirstLetter = (string: string): string => {
  const words = string.split(/ |-/);
  const newWords: string[] = [];
  for (let word of words) {
    const arr: string[] = word.split("");
    arr[0] = arr[0].toUpperCase();
    newWords.push(arr.join(""));
  }
  return newWords.join(" ");
};

const fetchCall = async (
  url: string,
  method: string = "GET",
  body: any = null
) => {
  const res = await fetch(url, {
    method: method,
    body: body === null ? null : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();
  return response;
};

module.exports = {
  capitaliseFirstLetter,
  fetchCall,
};
