import fs from 'fs';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { timeline } from './timeline';
import { config } from './config';

const title = `
┏┳┓┏┓┳┳┓┏┓  ┏┓┳┓┏┓┏┓┏┳┓┏┓┳┓
 ┃ ┃┃┃┃┃┣   ┃ ┣┫┣ ┣┫ ┃ ┃┃┣┫
 ┻ ┗┛┛ ┗┗┛  ┗┛┛┗┗┛┛┗ ┻ ┗┛┛┗
`;

const originFolder = config.originFolder;
const destinationFolder = config.destinationFolder;
const resizeRatio = config.resizeRatio;
const i18n_chapter = config.lang === 'fr' ? 'Chapitre' : 'Chapter';
const i18n_to = config.lang === 'fr' ? 'à' : 'to';

// ==============================================
//                     INIT
// ==============================================
const init = async () => {
	console.log(title);
	console.log(`➡️  ${originFolder.split('/')[1]}`);
	console.log('    - 📚 Tomes:', Object.keys(timeline).length);
	console.log('    - 📂 Origin folder:', originFolder);
	console.log('    - 📂 Destination folder:', destinationFolder);
	console.log(
		'    - 🔍 Resize ratio:',
		resizeRatio,
		`(${Math.floor((1 / resizeRatio) * 100)}%)`
	);
	console.log('    - 🌐 Language:', config.lang);
	console.log('\n====================================================\n');

	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	readline.question(
		`Which tome of "${originFolder.split('/')[1]}" do you want to create?
all   ==> All tomes (default)
14    ==> Tome 14
1,3,9 ==> Tome 1, 3 and 9
1-6   ==> Tome 1 to 6
14+   ==> Tome 14 to the end

Your choice [all]:`,
		async (tomeIndex: string) => {
			readline.close();

			// check if the destination folder exists
			if (!fs.existsSync(destinationFolder)) {
				fs.mkdirSync(destinationFolder, {
					recursive: true,
				});
			}

			console.log('');

			// ALL
			if (tomeIndex === 'all' || tomeIndex === '') {
				console.log('📚 Create all tomes\n');

				for (const key of Object.keys(timeline)) {
					const tomeIndex = +key.split(' ')[1];
					await createAndPopulateTomeFolder(tomeIndex);
				}
			}
			// 35+
			else if (tomeIndex.endsWith('+')) {
				const [start] = tomeIndex.split('+');
				const end = Object.keys(timeline).length;
				console.log(`📚 Create tomes from ${start} to the end (${end})\n`);

				for (let i = +start; i <= end; i++) {
					await createAndPopulateTomeFolder(i);
				}
			}
			// 1-3
			else if (tomeIndex.includes('-')) {
				const [start, end] = tomeIndex.split('-');
				console.log(`📚 Create tomes from ${start} to ${end}\n`);

				for (let i = +start; i <= +end; i++) {
					await createAndPopulateTomeFolder(i);
				}
			}
			// 1,3,7
			else if (tomeIndex.includes(',')) {
				const tomeIndexes = tomeIndex.split(',');
				console.log(`📚 Create tomes ${tomeIndexes.join(', ')}\n`);

				for (const index of tomeIndexes) {
					await createAndPopulateTomeFolder(+index);
				}
			}
			// 12
			else {
				console.log(`📚 Create tome ${tomeIndex}\n`);
				await createAndPopulateTomeFolder(+tomeIndex);
			}

			console.log('====================================================');
			console.log('🎉 All tomes created!');
			console.log(`📂 Go to: ${destinationFolder}\n`);
		}
	);
};

// ==============================================
//                     FUNCTIONS
// ==============================================
const createAndPopulateTomeFolder = async (tomeIndex: number) => {
	const tome = timeline[`Tome ${tomeIndex}` as keyof typeof timeline];
	let [start, end] = tome.chapter;
	let startFile = 1;

	console.log('====================================================');
	console.log(`📗 Tome ${tomeIndex} - ${tome.title}`);
	console.log(`(Chapter ${start} ==> ${end})\n`);

	// 1 - create temp tome folder
	console.log('📁 Create temporary folder\n');
	const tmpTomeFolder = `${destinationFolder}/[tmp]Tome ${tomeIndex} - ${tome.title} (${i18n_chapter} ${start} ${i18n_to} ${end})`;

	fs.mkdirSync(tmpTomeFolder, {
		recursive: true,
	});

	// 2 - gather all chapters content in the tome folder
	for (let chapter = start; chapter <= end; chapter++) {
		const chapterFolder = `${originFolder}/${chapter}`;
		console.log(`🏷️  Copy chapter ${chapter} in temporary folder`);

		// bring chapter content to the tome folder
		const files = fs.readdirSync(chapterFolder);

		for (const file of files) {
			const fileName =
				startFile < 10
					? `00${startFile}`
					: startFile < 100
					? `0${startFile}`
					: startFile;

			// resize the image
			const metadata = await sharp(`${chapterFolder}/${file}`).metadata();
			if (!metadata.width || !metadata.height) {
				console.log('❌ Error: no metadata');
				return;
			}

			// if the image is in landscape mode, rotate it
			if (metadata.width > metadata.height) {
				await sharp(`${chapterFolder}/${file}`, { failOn: 'truncated' })
					.rotate(90)
					.toFile(`${tmpTomeFolder}/${fileName}.jpg`);
			} else {
				await sharp(`${chapterFolder}/${file}`, { failOn: 'truncated' })
					.resize(
						Math.round(metadata.width / resizeRatio),
						Math.round(metadata.height / resizeRatio)
					)
					.toFile(`${tmpTomeFolder}/${fileName}.jpg`);
			}

			startFile++;
		}
	}

	// 3 - create a pdf file for the tome
	const files = fs.readdirSync(tmpTomeFolder);
	const pdf = new PDFDocument({
		autoFirstPage: false,
	});

	pdf.pipe(
		fs.createWriteStream(
			`${destinationFolder}/Tome ${tomeIndex} - ${tome.title} (${i18n_chapter} ${start} ${i18n_to} ${end}).pdf`
		)
	);

	for (const file of files) {
		pdf.addPage();

		pdf.image(`${tmpTomeFolder}/${file}`, 0, 0, {
			align: 'center',
			valign: 'center',
			fit: [pdf.page.width, pdf.page.height],
		});
	}

	pdf.end();
	console.log(`\n📄 PDF created`);

	console.log(`🗑️  Remove temporary folder\n`);
	fs.rm(tmpTomeFolder, { recursive: true }, (err) => {
		if (err) {
			console.log('❌ Error: remove folder');
		}
	});

	console.log('✅ Done!\n');
};

init();
