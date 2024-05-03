const parseEscapeCharacters = (str) => {
  let html = "";

  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "\n":
        html += "<br>";
        break;

      case " ":
        if (str[i - 1] !== " " && str[i - 1] !== "\t") html += " ";
        break;

      case "\t":
        html += "&nbsp";
        break;

      case "&":
        html += "&amp;";
        break;

      case '"':
        html += "&quot;";
        break;

      case ">":
        html += "&gt;";
        break;

      case "<":
        html += "&lt;";
        break;

      default:
        html += str[i];
    }
  }

  // console.log(html);
  return html;
};

export default parseEscapeCharacters;
