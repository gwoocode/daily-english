import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dataDirectory = path.join(process.cwd(), 'src/data');

export function getCategoryData(category) {
  const categoryDir = path.join(dataDirectory, category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(categoryDir);
  const sortedFileNames = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .sort();

  let allCards = [];
  let globalId = 1;

  for (const fileName of sortedFileNames) {
    const fullPath = path.join(categoryDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (data && Array.isArray(data.items)) {
      data.items.forEach((item) => {
        allCards.push({
          ...item,
          id: globalId++,
          sourceFile: fileName,
        });
      });
    }
  }

  return allCards;
}