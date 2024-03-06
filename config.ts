export const config = {
	// language: it will be used to create the file names
	// exemple: fr: "Tome 1 - XXXXXXXX (Chapitre 1 à 8).pdf")
	// exemple: en: "Tome 1 - XXXXXXXX (Chapter 1 to 8).pdf")
	// Available languages:
	// en: English
	// fr: French
	lang: 'fr',
	// Path to the folder containing the chapter images
	// (keep the trailing slash ./)
	originFolder: './One Piece',
	// Path to the folder where the tomes will be created.
	// !! NO SUBFOLDER !!
	// (keep the trailing slash ./)
	destinationFolder: "./One Piece - l'intégrale",
	// ratio to resize the images. The higher the number, the smaller the images
	// eg: 1.5 => 1/1.5 = 0.66 => 66% of the original size
	// 1000px => 660px
	resizeRatio: 1.5,
};
