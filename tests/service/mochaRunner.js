const Mocha = require('mocha');
const mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: '../../doc/mochawesome-reporter'
    }
});
mocha.addFile('./axios.spec.js');
mocha.run(function () {
    console.log('done aaa !!!!!!');
    process.exit();
});