# Hakuneko tome creator

When you download a manga with [Hakuneko](https://hakuneko.download/), you will have a main folder containing all chapter folders tht contains the images.

In order to read the manga on an e-reader or more easily on a computer, you will need to create a pdf file that regroup all the tome chapters, and do it for each tome of the manga.

And that's where this script comes in. It will create the pdf files for each tome of the manga 😎

## Prerequisites

- node
- npm
- typescript

## Installation

1. put `script.ts`, `config.ts`, `timeline.ts` and `package.json` in the folder containing the `./originFolder`
   _(the folder containing the images of the manga)_

it should look like this :

```
Mangas
├── script.ts
├── config.ts
├── timeline.ts
├── package.json
└── originFolder (eg. "One Piece")
    ├── 1
    │   ├── 01.jpg
    │   ├── 02.jpg
    │   ├── ...
    │   └── 47.jpg
    ├── 2
    │   ├── 01.jpg
    │   ├── 02.jpg
    │   ├── ...
    │   └── 47.jpg
    ├── 3
    │   ├── 01.jpg
    │   ├── 02.jpg
    │   ├── ...
    │   └── 47.jpg
    ├── ...
    └── 78
        ├── 01.jpg
        ├── 02.jpg
        ├── ...
        └── 47.jpg
```

Notice the name of the chapter folders (1, 2, 3, ...) and the name of the images (01.jpg, 02.jpg, ...) **are not random**
**For now, the script is only working with this pattern.**

2. run the following command in the terminal :

```bash
npm install
```

## Configuration

**⚠️ The chapter folders must be named with numbers (1, 2, 3, ...). No need to put 0 before the number**

**⚠️ Images must be named with numbers (01, 02, 03, ...). The extension can be `.jpg`, `.jpeg`, `.png`**

**⚠️ You can configure Hakuneko to named the chapter folders and images with the pattern needed**

1. fill the `config.ts` file with your values
2. fill the `timeline.ts` file with your values

_(you will find a exemple in `./timelines/__exemple.ts` or other timelines already set by the community like `./timelines/One Piece/fr.ts`)_

## How to use

Once you have finish the install and the configuration, you can run the script with the following command:

```bash
npm start
```

There will be a resume of the configuration you have set in the `config.ts` file.

Then it will prompt you to select the tome you want to create. Once you have selected the tome, the script will create the pdf file in the `destinationFolder`.

## Final Folder structure

```
Mangas
├── script.ts
├── package.json
├── config.ts
├── timeline.ts
├── originFolder
│   ├── 1
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   ├── ...
│   │   └── 47.jpg
│   ├── 2
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   ├── ...
│   │   └── 47.jpg
│   ├── 3
│   │   ├── 01.jpg
│   │   ├── 02.jpg
│   │   ├── ...
│   │   └── 47.jpg
│   ├── ...
│   └── 78
│       ├── 01.jpg
│       ├── 02.jpg
│       ├── ...
│       └── 47.jpg
└── destinationFolder
    ├── Tome 1 - <title> (Chapitre 1-47).pdf
    ├── Tome 2 - <title> (Chapitre 48-54).pdf
    ├── Tome 3 - <title> (Chapitre 55-78).pdf
    ├── ...
    └── Tome 26 - <title> (Chapitre 263-702).pdf
```

## docs

https://sharp.pixelplumbing.com/

https://www.npmjs.com/package/pdfkit

# Contributing

Fell free to contribute to this project, you can open an issue or a pull request. I will be happy to help you and to improve this project with you 😊
