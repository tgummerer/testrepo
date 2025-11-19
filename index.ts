// Copyright 2016-2025, Pulumi Corporation.  All rights reserved.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as mime from "mime";
import * as path from "path";

// Create a bucket and expose a website index document
const siteBucket = new aws.s3.Bucket("s3-website-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

const siteBucketWebsiteConfig = new aws.s3.BucketWebsiteConfiguration("s3-website-bucket-config", {
    bucket: siteBucket.id,
    indexDocument: {
        suffix: "index.html",
    },
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: siteBucket.id,
    blockPublicAcls: false,
});

const siteDir = "www"; // directory for content files

// Recursively walk a directory and return all file paths
function walkDirectory(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively walk subdirectories
            files.push(...walkDirectory(fullPath));
        } else if (stat.isFile()) {
            // Add file to the list
            files.push(fullPath);
        }
    }

    return files;
}

// Get all files recursively from the site directory
const allFiles = walkDirectory(siteDir);

// For each file, create an S3 object stored in `siteBucket`
for (const filePath of allFiles) {
    // Get the relative path from siteDir to use as the S3 key
    const relativeFilePath = path.relative(siteDir, filePath);

    // Create S3 object with the relative path as the key
    const siteObject = new aws.s3.BucketObject(relativeFilePath, {
        bucket: siteBucket,                               // reference the s3.Bucket object
        source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
        contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
}

// Set the access policy for the bucket so all objects are readable
const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: siteBucket.id, // refer to the bucket created earlier
    policy: pulumi.jsonStringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:GetObject",
            ],
            Resource: [
                pulumi.interpolate `${siteBucket.arn}/*`,
            ],
        }],
    }),
}, { dependsOn: publicAccessBlock });

// Stack exports
export const bucketName = siteBucket.bucket;
export const websiteUrl = siteBucketWebsiteConfig.websiteEndpoint;
