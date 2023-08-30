# Minify and Compress

A versatile Node.js script for automating file compression and minification. Use this script to effortlessly compress HTML, JavaScript, and CSS files within a specified directory. With support for the `node-minify` library and various compression techniques, it's the perfect tool to optimize your project's file sizes and improve web performance.

## Table of Contents

- [Preparation](#preparation)
- [Installation](#installation)
- [Required Libraries](#required-libraries)
- [Usage](#usage)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Preparation

Before using this script, make sure you have the following in place:

1. **Node.js:** Ensure that you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2. **Project Setup:** Prepare the source directory (`./source`) where your project files are located. Create the destination directory (`./deploy`) where the compressed files will be saved.

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/BananikXenos/minify-and-compress.git
   ```
2. Navigate to the repository's directory:
   ```bash
   cd minify-and-compress
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Required Libraries

This script utilizes the following libraries for various compression techniques:

- [@node-minify/core](https://www.npmjs.com/package/@node-minify/core)
- [@node-minify/google-closure-compiler](https://www.npmjs.com/package/@node-minify/google-closure-compiler)
- [@node-minify/clean-css](https://www.npmjs.com/package/@node-minify/clean-css)
- [@node-minify/html-minifier](https://www.npmjs.com/package/@node-minify/html-minifier)
    
These libraries are automatically installed when you run `npm install`.

## Usage
1. **Project Structure**: Ensure your project files are organized within the source directory (`./source`).

2. **Run the Script**: Execute the following command to run the script, providing the project and destination directories as arguments:
   ```bash
   node minify-compress.js /path/to/source /path/to/deploy
   ```
    Replace `/path/to/source` and `/path/to/deploy` with your actual source and destination paths.

3. **Compression Report**: The script will display a detailed compression report for each compressed file, including the saved percentage, new size, and old size.

4. **Total Summary**: After compressing all files, the script will display a summary of the total saved percentage, new total size, and original total size.

## Contributing

Contributions are welcome! If you have improvements, suggestions, or bug fixes, feel free to open an issue or submit a pull request. Please make sure to adhere to the project's code of conduct.

## Support

If you find this tool useful, you can support the project by:

- [Making a donation via PayPal](https://paypal.me/scgxenos)
- [Buying me a coffee](https://www.buymeacoffee.com/synse)

## License

This project is licensed under the [MIT License](LICENSE).