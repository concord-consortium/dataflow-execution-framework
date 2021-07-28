This project contains AWS lambda functions that are used to execute Rete programs in the cloud.  These programs are used by the Dataflow application.

### Initial steps

1. Clone this repo and `cd` into it
2. Run `npm install` to pull dependencies

## Deployment

When a lambda function is updated or changed, the source code is uploaded to the associated AWS lambda function.  In most cases a lambda function is only a sinlge source code file.  You can copy/paste source code directly in the Code Source panel in the AWS lambda console.  Alternately you can archive the source file(s) in a .zip file and upload the zip file in the AWS lambda console.  After updating and saving the source code in the AWS lambda console, use the Deploy button to deploy your changes.  Briefly, the steps are:
- update source code locally
- generate .zip file of source code (optional)
- login to AWS lambda console
- upload .zip file of source code or copy/paste source code into Code Source panel in AWS lambda console
- press Deploy button in the AWS lambda console to deploy your changes

### Testing

Run `npm test` to run tests.

## License

This project is Copyright 2019 (c) by the Concord Consortium and is distributed under the [MIT license](http://www.opensource.org/licenses/MIT).

See license.md for the complete license text.
