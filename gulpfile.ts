import * as gulp from "gulp";
import zip from "gulp-zip";
import webpack from 'webpack-stream';

const webpackConfig: any = {
    mode: 'development',
    target: 'node',
    output: {
        filename: `handler.js`,
        libraryTarget: 'commonjs2',
    },
    externals: {
        "aws-sdk": "aws-sdk",
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};

gulp.task('package state-machine', () => {
    return gulp.src('state-machine/handler.ts')
        .pipe(webpack(webpackConfig))
        .pipe(zip(`state-machine.zip`))
        .pipe(gulp.dest('build'));
});

gulp.task('package generic-bot', () => {
    return gulp.src('lex/bots/GenericBot.ts')
        .pipe(webpack(webpackConfig))
        .pipe(zip(`generic-bot.zip`))
        .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.parallel(
    'package state-machine',
    'package generic-bot',
));