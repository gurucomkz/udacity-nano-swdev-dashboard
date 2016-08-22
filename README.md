# Corporate Dashboard

This project is my milestone work for "Project 4: Corporate Dashboard" in [Senior Web Developer Udacity Nanodegree course](https://www.udacity.com/course/senior-web-developer-nanodegree-by-google--nd802).

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Data

Run `php dataGenerator/generator.php` to (re)generate data in `app/data` folder and in `dist` folder if present.

App will detect changes and show them on the dashboard.

## Build & development

Do `npm install` and `bower install` to prepare dependencies.

Run `grunt` for building and `grunt serve` for preview.

## Run

I recommend to test this way:

* `grunt`
* `cd dist`
* `python -m SimpleHTTPServer` - now you can see frequent requests for files.
* You can open dashboard app in your browser and see there is no data (or some if you did run data generator earlier).
* Open new terminal in the same location.
* `php ../dataGenerator/generator.php` -- this will write new files in `dist/data` and in browser you can see how data changed.

## Credits

Some styles were taken from AdminLTE template by [Almsaeed Studio](http://almsaeedstudio.com).
 
