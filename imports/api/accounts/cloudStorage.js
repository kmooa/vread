/**
 * Created by JohnBae on 4/29/17.
 */

Slingshot.fileRestrictions("myFileUploads", {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
    bucket: "revomake",
    acl: "public-read",
    AWSAccessKeyId: "AKIAIQMIFAYZRTGUPVXA",
    AWSSecretAccessKey: "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",
    region: "ap-northeast-2",
    authorize: function () {
        if (!this.userId) {
            var message = "Please login before posting files";
            throw new Meteor.Error("Login Required", message);
        }
        return true;
    },
    key: function (file) {
        console.log("FILE:", file);
        return Meteor.userId() + "/" + "profileImage.png";
    }
});