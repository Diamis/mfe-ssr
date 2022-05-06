import React from "react";

export default ({ title = "", assets = {}, children }) => {
  const { styles } = assets;
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <title>{title}</title>
        {styles}
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};
