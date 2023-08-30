const fs = require('fs').promises;
const path = require('path');
const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');
const cleanCSS = require('@node-minify/clean-css');
const htmlMinifier = require('@node-minify/html-minifier');

async function main() {
    // Read project directory and destination directory from command-line arguments
    const [,, projectDir, destinationDir] = process.argv;

    if (!projectDir || !destinationDir) {
        console.error('❌ Please provide both project directory and destination directory as command-line arguments.');
        return;
    }

    try {
        // Remove the destination directory if it exists
        await fs.rm(destinationDir, { recursive: true, force: true });

        // Create the destination directory
        await fs.mkdir(destinationDir, { recursive: true });

        // Function to recursively copy files and folders
        async function copyFiles(sourceDir, targetDir) {
            const files = await fs.readdir(sourceDir);

            for (const file of files) {
                const sourcePath = path.join(sourceDir, file);
                const targetPath = path.join(targetDir, file);

                const stats = await fs.stat(sourcePath);
                if (stats.isDirectory()) {
                    await fs.mkdir(targetPath);
                    await copyFiles(sourcePath, targetPath);
                } else {
                    await fs.copyFile(sourcePath, targetPath);
                }
            }
        }

        // Copy the entire project directory to the destination directory
        await copyFiles(projectDir, destinationDir);

        console.log('✅ Project files copied to', destinationDir);

        // Compress HTML, JavaScript, and CSS files using node-minify
        const filesToCompress = await getFilesToCompress(destinationDir);

        let totalStartingSize = 0;
        let totalFinalSize = 0;

        for (const file of filesToCompress) {
            const filePath = path.join(destinationDir, file);
            const startingSize = await getFilesizeInBytes(filePath);

            await compressFile(file, destinationDir);

            const finalSize = await getFilesizeInBytes(filePath);
            totalStartingSize += startingSize;
            totalFinalSize += finalSize;
        }

        const totalSavedRatio = ((1 - totalFinalSize / totalStartingSize) * 100).toFixed(2);
        const totalSavedSize = formatBytes(totalStartingSize - totalFinalSize);
        const totalOriginalSize = formatBytes(totalStartingSize);

        console.log(`🎉 Compression completed for all files`);
        console.log(`Total saved: ${totalSavedRatio}%, New total size: ${totalSavedSize}, Original total size: ${totalOriginalSize}`);
    } catch (error) {
        console.error('❌ An error occurred:', error);
    }
}

async function getFilesToCompress(rootDir) {
    const allFiles = [];

    async function traverse(dir, currentPath = '') {
        const items = await fs.readdir(dir);

        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stats = await fs.stat(itemPath);

            const relativePath = path.join(currentPath, item);

            if (stats.isDirectory()) {
                await traverse(itemPath, relativePath);
            } else if (/\.(html|js|css)$/i.test(item)) {
                allFiles.push(relativePath);
            }
        }
    }

    await traverse(rootDir);
    return allFiles;
}

async function getFilesizeInBytes(filename) {
    const stats = await fs.stat(filename);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}


async function compressFile(file, destinationDir) {
    const filePath = path.join(destinationDir, file);

    const startingSize = await getFilesizeInBytes(filePath);

    let compressor = null;
    if (file.endsWith('.js')) {
        compressor = gcc;
    } else if (file.endsWith('.css')) {
        compressor = cleanCSS;
    } else if (file.endsWith('.html')) {
        compressor = htmlMinifier;
    }

    if (compressor) {
        await minify({
            compressor,
            input: filePath,
            output: filePath,
            callback: async (err) => {
                if (err) {
                    console.error('❌ Error while compressing:', filePath);
                    console.error('Error:', err);
                    return;
                }

                const finalSize = await getFilesizeInBytes(filePath);
                const savedRatio = (100 - ((finalSize / startingSize) * 100)).toFixed(2);
                const savedSize = formatBytes(startingSize - finalSize);
                console.log(`✨ Compressed: ${filePath}, saved ${savedRatio}%, new size ${savedSize}`);
            }
        });
    }
}


main();
