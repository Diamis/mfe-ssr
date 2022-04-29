import React from 'react';

export default ({ title = '', assets = {}, children }) => {
  const { styles } = assets;
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>{title}</title>
        {styles}
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};
