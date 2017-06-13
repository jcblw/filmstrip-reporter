## Filmstrip reporter

#### Install

```shell
npm i filmstrip-reporter -g
```

#### Usage

```shell
filmstrip-reporter --url=https://google.com
```

##### options
- url : url to run filmstrip against. default: https://google.com
- viewport: width x height of browser. default: 1366x768
- foldHeight: the height of the fold you would scan. default: 300
- cookie: the cookies to use when requesting page. default: ''

![screenhot](https://github.com/jcblw/filmstrip-reporter/blob/master/assets/screenshot.png?raw=true)

This is a under development report that uses `phantomas` to generate filmstrips to be able to determine time to meaningful paint on a website.
