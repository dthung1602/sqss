<!-- README template from https://github.com/dthung1602/sqss -->


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="">
    <img src="docs/img/logo3.png" alt="SQSS" width="300">
  </a>
</p>


<!-- ABOUT THE PROJECT -->
## What is this?

<br />
<div align="center">
   <h3>You can now style your HTML with some good old SQL !</h3>
   <a href="https://dthung1602.github.io/sqss" ><h3>Try it in your browser!</h3></a>
   <br />
   <img src="docs/img/demo.png" width="500" />
</div>

## But why?

Why not?

After all [Cascading Server Sheets](https://dev.to/thormeier/dont-try-this-at-home-css-as-the-backend-what-3oih) is a
real thing, you know.

<p align="center">
    <img src="docs/img/comic.png" width="300"/>
    <br />
    <a href="https://www.smbc-comics.com/comic/qc">Source: smbc comics</a>
</p>


<!-- GETTING STARTED -->
## Getting Started

- For all supported features, see [examples](https://github.com/dthung1602/sqss/blob/master/example.md)

- To try SQSS in browser visit [demo page](https://dthung1602.github.io/sqss)

- To include the transpiler on your website, add the following line:

```html
<script src="TO BE ADDED" />
<script>
   const sqlString = `
        -- Add all of your styles here
        UPDATE styles
        SET "background" = 'blue'
        WHERE class = 'target';
   `;
   
   const cssString = transpileSQSSToCSS(cssString);
   document.head.innerHTML += `<style>${cssString}</style>`;
</script>
```

- To bundle it with your project, call the transpile function in your build script:

```js
const sqss = require("sqss");
const fs = require("fs");

const sqlString = fs.readFileSync("path/to/your/stylesheet.sql", "utf-8");
const cssString = sqss.transpileSQSSToCSS(sqlString);

fs.writeFileSync("path/to/your/build/folder/output.css", cssString);
```

**_We do support TypeScript!_**

## Put SQSS to production

No. 

Don't. 

Please.


<!-- LICENSE -->
## License

Distributed under the WTFPL License.

**You just DO WHAT THE F*CK YOU WANT TO**


<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request






<!-- CONTACT -->
## Contact

Duong Thanh Hung - [dthung1602@gmail.com](mailto:dthung1602@gmail.com)

Project Link: [https://github.com/dthung1602/sqss](https://github.com/dthung1602/sqss)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Best README template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields](https://shields.io)
* [Cascading Server Sheets](https://dev.to/thormeier/dont-try-this-at-home-css-as-the-backend-what-3oih)
* [IaSQL](https://iasql.com/)
* [SMBC Comics](https://www.smbc-comics.com/comic/qc)






<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/dthung1602/sqss.svg?style=flat-square
[contributors-url]: https://github.com/dthung1602/sqss/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dthung1602/sqss.svg?style=flat-square
[forks-url]: https://github.com/dthung1602/sqss/network/members
[stars-shield]: https://img.shields.io/github/stars/dthung1602/sqss.svg?style=flat-square
[stars-url]: https://github.com/dthung1602/sqss/stargazers
[issues-shield]: https://img.shields.io/github/issues/dthung1602/sqss.svg?style=flat-square
[issues-url]: https://github.com/dthung1602/sqss/issues
[license-shield]: https://img.shields.io/github/license/dthung1602/sqss.svg?style=flat-square
[license-url]: https://github.com/dthung1602/sqss/blob/master/LICENSE
