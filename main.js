const fs = require('fs');

const deviceIP = '192.168.0.195'

function archiveDirToZip(dir, zipPath, callback) {
    let output = fs.createWriteStream(zipPath);
    const archiver = require('archiver');
    let archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        callback();
    });

    archive.pipe(output);
    archive.directory(dir, '');
    archive.finalize();
}

function uploadOneFile(path, url) {
    const options = {
        auth: {
            user: 'rokudev',
            pass: 'rokudev',
            sendImmediately: false
        },
        formData: {
            mysubmit: "Replace",
            archive: fs.createReadStream(path)
        }
    }
    const request = require('request');

    request.post(url, options, function (error, res, body) {
        if (error) {
            console.error(body);
        } else if (res.statusCode !== 200) {
            console.error("Failed to upload! statusCode: %s", res.statusCode);
        } else {
            console.info("Uploaded successfully");
        }
    });
}

const zipPath = './dev.zip'
const dir = './app'
const url = "http://" + deviceIP + "/plugin_install"

archiveDirToZip(dir, zipPath, () => {
    uploadOneFile(zipPath, url);
});
