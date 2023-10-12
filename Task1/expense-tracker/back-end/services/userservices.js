exports.getExpenses = (req) => req.user.getExpenses();

exports.createDownloadedFile = (req, fileUrl) => {
    console.log(req.user);
    req.user.createDownloadedFile({fileUrl});
}